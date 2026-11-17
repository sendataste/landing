// app.js
const {
    createApp,
    ref,
    watch,
    computed,
    onMounted,
    onUnmounted
} = Vue;

const app = createApp({
    setup() {
        // ========== CONFIG GLOBAL ==========
        const CONFIG = window.SENDA_CONFIG || {};
        const whatsappNumber = CONFIG.whatsappNumber || '5491161123904';

        const whatsappLink = computed(() => CONFIG.getWhatsappLink
            ? CONFIG.getWhatsappLink()
            : `https://wa.me/${whatsappNumber}`
        );

        const googleMapsLink = CONFIG.googleMapsLink || 'https://maps.google.com/?q=Senda+Sushi';

        const scrolled = ref(false);

        // ========== AUTH + SUPABASE ==========
        const currentUser = ref(null);
        const authModalOpen = ref(false);
        const userMenuOpen = ref(false);
        const authEmail = ref('');
        const authLoading = ref(false);
        const authMessage = ref('');
        const authError = ref('');

        const myOrders = ref([]);
        const submittingOrder = ref(false);
        const orderError = ref('');
        const newPassword = ref('');
        const showResetForm = ref(false);
        const authPassword = ref('');
        const isRegistering = ref(false); // false = Ingresar, true = Registrarse
        const useMagicLink = ref(false); // false = Contraseña, true = Magic Link

        // Menu UX state
        const selectedCategory = ref('all');
        const menuSearch = ref('');
        const showFilterPanel = ref(false);
        const activeFeatureFilters = ref([]);
        const openAccordions = ref([]);
        const expandedCategories = ref([]);
        const selectedProduct = ref(null);
        const isModalOpen = ref(false);
        const modalVisible = ref(false);

        const selectedOption = ref('');
        const selectedVariantLabel = ref('');

        const mobileMenuOpen = ref(false);
        const isPageReady = ref(false);
        const mobileMenuDropdownOpen = ref(false);
        const currentSlide = ref(0);
        let autoplayInterval = null;

        const checkout = ref({
            name: '',
            phone: '',
            order_type: 'delivery',
            address: '',
            notes: ''
        });

        const sb = window.sb;

        const ordersModalOpen = ref(false);
        const ordersModalVisible = ref(false); 

        const openOrdersModal = () => {
            ordersModalOpen.value = true;
            if (currentUser.value) loadMyOrders(); // Actualizar datos
            closeUserMenu();
            requestAnimationFrame(() => {
             ordersModalVisible.value = true;
            });
        };
        const closeOrdersModal = () => {
            ordersModalVisible.value = false;       // 👈 baja la que controla el v-show
            setTimeout(() => {
                ordersModalOpen.value = false;      // limpia el flag lógico después de la transición
            }, 200);
        };

        // --- Auth listeners ---
        const initAuth = async () => {
            const { data: { session } } = await sb.auth.getSession();
            currentUser.value = session?.user || null;
            if (currentUser.value) {
                loadProfileDefaults();
                loadMyOrders();
            }

            sb.auth.onAuthStateChange((_event, session) => {
                currentUser.value = session?.user || null;
                if (currentUser.value) {
                    loadProfileDefaults();
                    loadMyOrders();
                } else {
                    myOrders.value = [];
                }
            });
        };

        const loadProfileDefaults = async () => {
            if (!currentUser.value) return;
            const { data } = await sb.from('profiles')
                .select('full_name, phone, default_address')
                .eq('id', currentUser.value.id)
                .single();
            if (data) {
                checkout.value.name = checkout.value.name || data.full_name || '';
                checkout.value.phone = checkout.value.phone || data.phone || '';
                checkout.value.address = checkout.value.address || data.default_address || '';
            }
        };

        // Guarda/actualiza los datos del perfil del usuario
        const saveProfileDefaults = async () => {
            if (!currentUser.value) return;

            const payload = {
                id: currentUser.value.id,
                full_name: checkout.value.name?.trim() || null,
                phone: checkout.value.phone?.trim() || null,
                default_address: checkout.value.address?.trim() || null,
                updated_at: new Date().toISOString()
            };

            const { error } = await sb.from('profiles').upsert(payload, {
                onConflict: 'id'
            });

            if (error) {
                console.warn('No se pudo guardar el perfil:', error.message);
            }
        };

        const loadMyOrders = async () => {
            if (!currentUser.value) return;
            const { data, error } = await sb.from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false });
            if (!error) myOrders.value = data || [];
        };

        const openAuthModal = () => {
            authModalOpen.value = true;
            authMessage.value = '';
            authError.value = '';
        };
        const closeAuthModal = () => { authModalOpen.value = false; };

        const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value; };
        const closeUserMenu = () => { userMenuOpen.value = false; };

        const signInWithGoogle = async () => {
            authLoading.value = true;
            authError.value = '';
            const { error } = await sb.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            authLoading.value = false;
            if (error) authError.value = error.message;
        };

        const signInWithMagicLink = async () => {
            if (!authEmail.value) return;
            authLoading.value = true;
            authError.value = '';
            authMessage.value = '';
            const { error } = await sb.auth.signInWithOtp({
                email: authEmail.value,
                options: {
                    emailRedirectTo: window.location.origin + window.location.pathname
                }
            });
            authLoading.value = false;
            if (error) authError.value = error.message;
            else authMessage.value = 'Revisá tu email, te mandamos el link de acceso.';
        };

        const signOut = async () => {
            await sb.auth.signOut();
            closeUserMenu();
        };

        // Estado nuevo
        const orderSent = ref(false);           // true cuando ya se abrió WhatsApp
        const pendingOrderPayload = ref(null);  // payload temporal antes de guardar

        // --- AUTENTICACIÓN ---
        const handlePasswordAuth = async () => {
            if (!authEmail.value || !authPassword.value) return;
            authLoading.value = true;
            authError.value = '';
            authMessage.value = '';

            try {
                if (isRegistering.value) {
                    const { error } = await sb.auth.signUp({
                        email: authEmail.value.trim().toLowerCase(),
                        password: authPassword.value,
                    });
                    if (error) throw error;
                    authMessage.value = 'Registro exitoso. Ya podés ingresar.';
                    isRegistering.value = false;
                } else {
                    const { error } = await sb.auth.signInWithPassword({
                        email: authEmail.value,
                        password: authPassword.value,
                    });
                    if (error) throw error;
                    closeAuthModal();
                }
            } catch (error) {
                authError.value = error.message;
            } finally {
                authLoading.value = false;
            }
        };

        const resetPassword = async () => {
            if (!authEmail.value) return;
            authLoading.value = true;
            authError.value = '';
            authMessage.value = '';
            const { error } = await sb.auth.resetPasswordForEmail(authEmail.value, {
                redirectTo: window.location.origin + window.location.pathname + '?reset=1'
            });
            authLoading.value = false;
            if (error) authError.value = error.message;
            else authMessage.value = 'Te enviamos un email para restablecer tu contraseña.';
        };
        // Confirmar pedido (versión invitado)
        // const confirmOrderAsGuest = async () => {
        //     if (!pendingOrderPayload.value) return;
        //     submittingOrder.value = true;
        //     orderError.value = '';

        //     // Si no hay usuario, iniciar sesión anónimo primero
        //     if (!currentUser.value) {
        //         const { data, error } = await sb.auth.signInAnonymously();
        //         if (error) {
        //             orderError.value = 'No se pudo crear sesión de invitado: ' + error.message;
        //             submittingOrder.value = false;
        //             return;
        //         }
        //         currentUser.value = data.user;
        //     }

        //     // Luego ejecutar el RPC create_order_with_items original
        //     // ... (el resto es igual que confirmOrderSaved)
        // };

        // Paso 1: abrir WhatsApp con el mensaje
        // Paso 1: abrir WhatsApp con el mensaje y guardar automáticamente
        const sendOrderViaWhatsapp = async () => {
            if (!cart.value.length) return;

            // Validación básica
            if (!checkout.value.name?.trim()) {
                orderError.value = 'Ingresá tu nombre para continuar.';
                return;
            }
            if (!checkout.value.phone?.trim()) {
                orderError.value = 'Ingresá tu teléfono para continuar.';
                return;
            }
            if (checkout.value.order_type === 'delivery' && !checkout.value.address?.trim()) {
                orderError.value = 'Ingresá la dirección de delivery.';
                return;
            }

            orderError.value = '';
            submittingOrder.value = true;

            // Guardar perfil solo si hay usuario real (no anónimo)
            if (currentUser.value && !currentUser.value.is_anonymous) {
                saveProfileDefaults();
            }

            // 1. Armar mensaje de WhatsApp
            const lines = [
                `Hola SENDA 🍣, soy ${checkout.value.name}.`,
                `Pedido: ${checkout.value.order_type === 'delivery' ? 'Delivery' : 'Take away'}`,
                ''
            ];

            cart.value.forEach((item, idx) => {
                const parts = [`${idx + 1}. ${item.qty}x ${item.name}`];
                if (item.variant) parts.push(`(${item.variant})`);
                if (item.option) parts.push(`- ${item.option}`);
                lines.push(parts.join(' '));
            });

            lines.push('');
            if (checkout.value.address) lines.push(`Dirección: ${checkout.value.address}`);
            if (checkout.value.notes) lines.push(`Notas: ${checkout.value.notes}`);
            lines.push(`Total: ${formatPrice(cartSubtotal.value)}`);

            // 2. Payload del pedido
            pendingOrderPayload.value = {
                order_type: checkout.value.order_type,
                payment_method: 'cash',
                customer_name: checkout.value.name,
                customer_phone: checkout.value.phone,
                delivery_address: checkout.value.order_type === 'delivery' ? checkout.value.address : null,
                notes: checkout.value.notes || null,
                subtotal: cartSubtotal.value,
                shipping_cost: 0,
                discount: 0,
                total: cartSubtotal.value
            };

            // 3. Abrir WhatsApp
            const url = CONFIG.getWhatsappLink
                ? CONFIG.getWhatsappLink(lines.join('\n'))
                : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

            window.open(url, '_blank');

            // 4. Guardar automáticamente en Supabase
            try {
                // Sesión anónima si no hay usuario
                if (!currentUser.value) {
                    const { data, error } = await sb.auth.signInAnonymously();
                    if (error) throw new Error('Error al crear sesión de invitado: ' + error.message);
                    currentUser.value = data.user;
                }

                // Items
                const itemsPayload = cart.value.map(i => ({
                    product_name: i.name,
                    variant: i.variant || null,
                    option: i.option || null,
                    unit_price: parsePrice(i.price),
                    quantity: i.qty
                }));

                // RPC
                const { data: orderId, error: rpcError } = await sb.rpc('create_order_with_items', {
                    p_order: pendingOrderPayload.value,
                    p_items: itemsPayload
                });

                if (rpcError) throw rpcError;

                console.log('✅ Pedido guardado con ID:', orderId);

                // 5. Limpieza exitosa (sin abrir modal de "¿Vaciar carrito?")
                cart.value = [];
                closeCart();
                orderSent.value = false;
                pendingOrderPayload.value = null;
                checkout.value.notes = '';

                // Refrescar perfil si es usuario real
                if (currentUser.value && !currentUser.value.is_anonymous) {
                    await saveProfileDefaults();
                }

                // Refrescar "Mis pedidos"
                loadMyOrders();

            } catch (error) {
                console.error('❌ Error guardando pedido:', error);
                orderError.value = 'El pedido se envió por WhatsApp, pero no pudimos guardarlo en tu historial: ' + error.message;
                // 👆 Importante: el usuario ve el error, pero el pedido YA salió por WhatsApp.
                // No limpiamos el carrito para que pueda reintentar el guardado o revisar.
            } finally {
                submittingOrder.value = false;
            }
        };

        // --- CONFIRMACIÓN DE PEDIDO (GUEST Y LOGUEADO) ---
        // const confirmOrderSaved = async () => {
        //     if (!pendingOrderPayload.value) return;

        //     submittingOrder.value = true;
        //     orderError.value = '';

        //     try {
        //         // 1. Si no hay usuario logueado, creamos un usuario anónimo (Guest)
        //         if (!currentUser.value) {
        //             const { data, error } = await sb.auth.signInAnonymously();
        //             if (error) throw new Error('Error al crear sesión de invitado: ' + error.message);
        //             currentUser.value = data.user;
        //         }

        //         // 2. Preparamos los ítems
        //         const itemsPayload = cart.value.map(i => ({
        //             product_name: i.name,
        //             variant: i.variant || null,
        //             option: i.option || null,
        //             unit_price: parsePrice(i.price),
        //             quantity: i.qty
        //         }));

        //         // 3. Guardamos el pedido en Supabase
        //         const { data: orderId, error: rpcError } = await sb.rpc('create_order_with_items', {
        //             p_order: pendingOrderPayload.value,
        //             p_items: itemsPayload
        //         });

        //         if (rpcError) throw rpcError;

        //         // 4. Limpieza exitosa
        //         // console.log('pasa');
        //         clearCart();
        //         closeCart();
        //         orderSent.value = false;
        //         pendingOrderPayload.value = null;
        //         checkout.value.notes = '';

        //         // Si es un usuario real (no guest), actualizamos su perfil con los datos ingresados
        //         if (currentUser.value && !currentUser.value.is_anonymous) {
        //             await saveProfileDefaults();
        //         }

        //         loadMyOrders();

        //     } catch (error) {
        //         orderError.value = 'No pudimos guardar tu pedido: ' + error.message;
        //     } finally {
        //         submittingOrder.value = false;
        //     }
        // };


        // Helpers de estado
        const statusLabel = (s) => ({
            pending: 'Pendiente',
            confirmed: 'Confirmado',
            preparing: 'Preparando',
            ready: 'Listo',
            delivered: 'Entregado',
            cancelled: 'Cancelado'
        }[s] || s);

        const statusClass = (s) => ({
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-orange-100 text-orange-800',
            ready: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        }[s] || 'bg-gray-100 text-gray-700');


        // ========== CARRITO ==========
        const CART_STORAGE_KEY = 'senda_cart_v1';

        const cart = ref([]);
        const cartOpen = ref(false);

        // Cargar carrito desde localStorage
        const loadCartFromStorage = () => {
            try {
                const raw = localStorage.getItem(CART_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        cart.value = parsed;
                    }
                }
            } catch (e) {
                console.warn('No se pudo leer el carrito:', e);
            }
        };

        // Guardar carrito
        const persistCart = () => {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.value));
            } catch (e) {
                console.warn('No se pudo guardar el carrito:', e);
            }
        };

        // Observar cambios y persistir
        watch(cart, persistCart, { deep: true });

        // Nuevas categorías según segmentación
        const menuCategories = ref([
            { id: 'entradas', name: 'Entradas', icon: '🥟' },
            { id: 'platos', name: 'Platos', icon: '🍜' },
            { id: 'cortes', name: 'Cortes', icon: '🔪' },
            { id: 'sushi', name: 'Sushi', icon: '🍣' },
            { id: 'fusion', name: 'Fusión', icon: '🌶️' },
            { id: 'rolls', name: 'Rolls', icon: '🍱' },
            { id: 'tablas', name: 'Tablas', icon: '🎎' },
            { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
            { id: 'postres', name: 'Postres', icon: '🍰' }
        ]);

        const categories = ref([
            { id: 'all', name: 'Todo', icon: '●' },
            ...menuCategories.value
        ]);

        const carouselImages = ref([
            { src: 'assets/carrousel/16.59.36.jpeg', alt: 'SENDA Sushi - Imagen 1' },
            { src: 'assets/carrousel/17.13.13.jpeg', alt: 'SENDA Sushi - Imagen 2' },
            { src: 'assets/carrousel/17.13.56.jpeg', alt: 'SENDA Sushi - Imagen 3' },
            { src: 'assets/carrousel/17.14.31.jpeg', alt: 'SENDA Sushi - Imagen 4' },
            { src: 'assets/carrousel/17.17.27.jpeg', alt: 'SENDA Sushi - Imagen 5' }
        ]);

        // NUEVA ESTRUCTURA DE MENÚ SEGÚN SEGMENTACIÓN
        const menuItems = ref(window.SENDA_MENU_ITEMS || []);

        const schedules = ref([
            { day: 'Almuerzo:', hours: 'Miércoles a Sábados de 12 a 15:30hs' },
            { day: 'Cena:', hours: 'Martes a Domingos de 19 a 23hs' }
        ]);

        const socialLinks = ref([
            { icon: 'fab fa-instagram', link: 'https://www.instagram.com/sendasushi' },
            { icon: 'fab fa-facebook', link: 'https://www.facebook.com/share/1EiV5XMfN6/' }
        ]);

        // Flags disponibles según segmentación
        const availableFlags = computed(() => {
            const flags = [...new Set(
                menuItems.value.flatMap(item => item.flags || [])
            )];
            // Ordenar alfabéticamente para mostrarlas de forma consistente
            return flags.sort();
        });
        // const availableFlags = computed(() => {
        //     const flagsMap = {
        //         'Veggie': '🥬 Veggie',
        //         'Picante': '🌶️ Picante',
        //         'Tempura': '🍤 Tempura',
        //         'Empanado': '🍘 Empanado',
        //         'Sin TACC': '🌾 Sin TACC',
        //         'Opción Veggie': '🌱 Opción Veggie'
        //     };

        //     const flags = [...new Set(
        //         menuItems.value.flatMap(item => item.flags || [])
        //     )];

        //     return flags.filter(flag => flagsMap[flag]);
        // });

        const normalizedSearch = computed(() =>
            menuSearch.value.trim().toLowerCase()
        );

        const matchesMenuFilters = (item) => {
            const categoryMatches =
                selectedCategory.value === 'all' ||
                item.category === selectedCategory.value;

            const searchText = [
                item.name,
                item.secondname,
                item.type,
                item.contents,
                item.subcategory,
                item.pieces,
                ...(item.flags || [])
            ].join(' ').toLowerCase();

            const searchMatches = !normalizedSearch.value ||
                searchText.includes(normalizedSearch.value);

            const featureMatches =
                activeFeatureFilters.value.length === 0 ||
                activeFeatureFilters.value.every(flag =>
                    (item.flags || []).includes(flag)
                );

            return categoryMatches && searchMatches && featureMatches;
        };

        const menuGroups = computed(() => {
            return menuCategories.value.map(category => {
                const items = menuItems.value.filter(item =>
                    item.category === category.id &&
                    matchesMenuFilters(item)
                );

                return {
                    ...category,
                    items
                };
            }).filter(group => group.items.length > 0);
        });

        const visibleCategoryGroups = computed(() => {
            return menuGroups.value.map(group => {
                const isExpanded = expandedCategories.value.includes(group.id);
                const shouldShowAll = !!normalizedSearch.value ||
                    activeFeatureFilters.value.length > 0 ||
                    isExpanded;
                const validItems = group.items.filter(item => item && typeof item === 'object' && item.name);
                return {
                    ...group,
                    visibleItems: shouldShowAll ? validItems : validItems.slice(0, productPreviewLimit)
                };
            });
        });

        const totalVisibleProducts = computed(() =>
            menuGroups.value.reduce((total, group) => total + group.items.length, 0)
        );

        const searchResultCount = computed(() => totalVisibleProducts.value);

        const productPreviewLimit = 5;

        const selectedVariant = computed(() => {
            if (!selectedProduct.value || !selectedProduct.value.variants?.length) return null;
            return selectedProduct.value.variants.find(v => v.label === selectedVariantLabel.value) ||
                selectedProduct.value.variants[0];
        });

        const selectedProductPrice = computed(() =>
            selectedVariant.value?.price || selectedProduct.value?.price || ''
        );

        const productWhatsappLink = computed(() => {
            if (!selectedProduct.value) return '#';

            const option = selectedVariant.value
                ? ` - ${selectedVariant.value.label}`
                : (selectedOption.value ? ` - ${selectedOption.value}` : '');

            const text = `Hola SENDA, quiero pedir ${selectedProduct.value.name}${option}. Precio: ${selectedProductPrice.value}`;

            return CONFIG.getWhatsappLink
                ? CONFIG.getWhatsappLink(text)
                : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
        });

        const selectVariant = (variant) => {
            selectedVariantLabel.value = variant.label;
        };

        const selectCategory = (categoryId) => {
            selectedCategory.value = categoryId;

            if (categoryId !== 'all' && !openAccordions.value.includes(categoryId)) {
                openAccordions.value = [categoryId];
            }

            if (categoryId === 'all' && !openAccordions.value.length) {
                openAccordions.value = ['entradas'];
            }
        };

        const toggleAccordion = (categoryId) => {
            if (openAccordions.value.includes(categoryId)) {
                openAccordions.value = openAccordions.value.filter(
                    id => id !== categoryId
                );
            } else {
                openAccordions.value = [categoryId];
            }
        };

        const toggleCategoryExpanded = (categoryId) => {
            if (expandedCategories.value.includes(categoryId)) {
                expandedCategories.value = expandedCategories.value.filter(
                    id => id !== categoryId
                );
            } else {
                expandedCategories.value = [
                    ...expandedCategories.value,
                    categoryId
                ];
            }
        };

        const toggleFeatureFilter = (flag) => {
            if (activeFeatureFilters.value.includes(flag)) {
                activeFeatureFilters.value =
                    activeFeatureFilters.value.filter(item => item !== flag);
            } else {
                activeFeatureFilters.value = [
                    ...activeFeatureFilters.value,
                    flag
                ];
            }

            const firstGroup = menuGroups.value[0];
            if (firstGroup) {
                openAccordions.value = [firstGroup.id];
            }
        };

        const clearMenuSearch = () => {
            menuSearch.value = '';
        };

        const clearAllFilters = () => {
            menuSearch.value = '';
            selectedCategory.value = 'all';
            activeFeatureFilters.value = [];
            expandedCategories.value = [];
            showFilterPanel.value = false;
            openAccordions.value = ['entradas'];
        };

        const openProduct = (item, event) => {
            // ✅ Bloqueo 1: la página debe estar lista
            if (!isPageReady.value) {
                console.warn('⏳ Página aún no lista, ignorando click');
                return;
            }

            // ✅ Bloqueo 2: validar item
            if (!item || typeof item !== 'object' || !item.name) {
                console.warn('⚠️ openProduct recibió un item inválido:', item);
                return;
            }

            // ✅ Bloqueo 3: si viene un evento, verificar que sea un click real del usuario
            if (event) {
                if (event.type !== 'click') return;
                if (event.isTrusted === false && event.detail === 0) {
                    console.warn('🚫 Click sintético ignorado');
                    return;
                }
            }

            console.log('✅ Abriendo producto:', item.name);

            // Seteamos primero el producto, y en el siguiente frame mostramos el modal
            selectedProduct.value = item;
            selectedOption.value = item.options && item.options.length ? item.options[0] : '';
            selectedVariantLabel.value = item.variants && item.variants.length ? item.variants[0].label : '';

            requestAnimationFrame(() => {
                isModalOpen.value = true;
                modalVisible.value = true;
            });

            document.body.classList.add('menu-lock-scroll');
        };

        const closeProduct = () => {
            modalVisible.value = false;
            isModalOpen.value = false;

            // Esperamos a que termine la transición antes de limpiar el producto
            setTimeout(() => {
                selectedProduct.value = null;
                selectedOption.value = '';
                selectedVariantLabel.value = '';
            }, 250);

            document.body.classList.remove('menu-lock-scroll');
        };

        const getFlagClass = (flag) => {
            const classes = {
                'Picante': 'bg-red-100 text-red-800',
                'Veggie': 'bg-green-100 text-green-800',
                'Tempura': 'bg-orange-200 text-orange-700',
                'Flameado': 'bg-amber-800 text-white',
                'Empanado': 'bg-yellow-200 text-yellow-800',
                'Sin TACC': 'bg-purple-100 text-purple-800',
                'Opción Veggie': 'bg-emerald-100 text-emerald-800'
            };

            return classes[flag] || 'bg-gray-200 text-gray-700';
        };

        const toggleMobileMenu = () => {
            mobileMenuOpen.value = !mobileMenuOpen.value;
            if (!mobileMenuOpen.value) {
                mobileMenuDropdownOpen.value = false;
            }
        };

        const toggleMobileMenuDropdown = () => {
            mobileMenuDropdownOpen.value = !mobileMenuDropdownOpen.value;
        };

        const closeMobileMenu = () => {
            mobileMenuOpen.value = false;
            mobileMenuDropdownOpen.value = false;
        };

        const scrollToCategory = (categoryId) => {
            closeMobileMenu();
            selectCategory(categoryId);

            const menuSection = document.getElementById('menu');
            if (menuSection) {
                menuSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        };

        // Carousel functions
        const nextSlide = () => {
            currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length;
            resetAutoplay();
        };

        const prevSlide = () => {
            currentSlide.value = (currentSlide.value - 1 + carouselImages.value.length) % carouselImages.value.length;
            resetAutoplay();
        };

        const goToSlide = (index) => {
            currentSlide.value = index;
            resetAutoplay();
        };

        const startAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
            autoplayInterval = setInterval(() => {
                currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length;
            }, 4000);
        };

        const resetAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                startAutoplay();
            }
        };

        // ========== REVIEWS ==========
        const reviews = ref([]);
        const reviewsLoaded = ref(false);
        const reviewPage = ref(0);
        const reviewsPerView = ref(1);

        let reviewAutoplay = null;
        let reviewAutoplayResume = null;
        const reviewAutoplayInterval = 5000; // 5 segundos

        const updateReviewsPerView = () => {
            if (window.innerWidth >= 1024) reviewsPerView.value = 3;
            else if (window.innerWidth >= 640) reviewsPerView.value = 2;
            else reviewsPerView.value = 1;
            // Al cambiar el tamaño, reseteamos a la primera página
            reviewPage.value = 0;
        };

        // Solo reviews >= 4 estrellas
        const filteredReviews = computed(() => {
            return reviews.value.filter(r => r.starsNumber >= 4);
        });

        const averageRating = computed(() => {
            if (!filteredReviews.value.length) return 0;
            const total = filteredReviews.value.reduce((s, r) => s + r.starsNumber, 0);
            return total / filteredReviews.value.length;
        });

        // Agrupar las reviews en páginas de N cards
        const reviewPages = computed(() => {
            const perView = reviewsPerView.value;
            const pages = [];
            const list = filteredReviews.value;
            for (let i = 0; i < list.length; i += perView) {
                pages.push(list.slice(i, i + perView));
            }
            return pages;
        });

        const totalReviewPages = computed(() => reviewPages.value.length);

        // Dots inteligentes para mobile: siempre 5 como máximo (incluye flechas)
        // Muestra: [1] […] [actual] […] [última]
        const mobileDots = computed(() => {
            const total = totalReviewPages.value;
            const current = reviewPage.value;
            if (total <= 5) {
                // Si hay pocas páginas, mostrarlas todas
                return Array.from({ length: total }, (_, i) => ({
                    label: String(i + 1),
                    page: i,
                    active: i === current,
                    ellipsis: false
                }));
            }

            const dots = [];
            const first = 0;
            const last = total - 1;

            // Siempre mostramos la primera
            dots.push({
                label: '1',
                page: first,
                active: current === first,
                ellipsis: false
            });

            // Rango alrededor del actual
            let start = Math.max(1, current - 1);
            let end = Math.min(last - 1, current + 1);

            // Si estamos cerca del inicio
            if (current <= 1) {
                start = 1;
                end = 3;
            }
            // Si estamos cerca del final
            if (current >= last - 1) {
                start = last - 3;
                end = last - 1;
            }

            // Elipsis antes
            if (start > 1) {
                dots.push({ label: '…', page: null, active: false, ellipsis: true });
            }

            // Páginas del medio
            for (let i = start; i <= end; i++) {
                dots.push({
                    label: String(i + 1),
                    page: i,
                    active: i === current,
                    ellipsis: false
                });
            }

            // Elipsis después
            if (end < last - 1) {
                dots.push({ label: '…', page: null, active: false, ellipsis: true });
            }

            // Siempre mostramos la última
            dots.push({
                label: String(last + 1),
                page: last,
                active: current === last,
                ellipsis: false
            });

            return dots;
        });

        const nextReviewPage = () => {
            const max = totalReviewPages.value - 1;
            if (max < 0) return;
            reviewPage.value = reviewPage.value >= max ? 0 : reviewPage.value + 1;
            pauseReviewAutoplayTemporarily();
        };

        const prevReviewPage = () => {
            const max = totalReviewPages.value - 1;
            if (max < 0) return;
            reviewPage.value = reviewPage.value <= 0 ? max : reviewPage.value - 1;
            pauseReviewAutoplayTemporarily();
        };

        const goToReviewPage = (index) => {
            if (index === reviewPage.value) return;
            reviewPage.value = index;
            pauseReviewAutoplayTemporarily();
        };

        // Genera una clave única por producto + variante + opción
        const cartItemKey = (name, variant, option) => {
            return [name, variant || '', option || ''].join('||');
        };

        // Cantidad total de ítems (sumando cantidades)
        const cartTotalItems = computed(() =>
            cart.value.reduce((sum, item) => sum + item.qty, 0)
        );

        // Subtotal formateado (opcional, sin decimales)
        const parsePrice = (priceStr) => {
            if (!priceStr) return 0;
            const digits = String(priceStr).replace(/[^\d]/g, '');
            return parseInt(digits, 10) || 0;
        };

        const formatPrice = (n) =>
            '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });

        const cartSubtotal = computed(() =>
            cart.value.reduce((sum, item) => {
                return sum + parsePrice(item.price) * item.qty;
            }, 0)
        );

        const addToCart = () => {
            if (!selectedProduct.value) return;

            const variantLabel = selectedVariant.value?.label || '';
            const optionLabel = selectedVariant.value
                ? ''
                : (selectedOption.value || '');

            const price = selectedProductPrice.value;
            const key = cartItemKey(selectedProduct.value.name, variantLabel, optionLabel);

            const existing = cart.value.find(i => i.key === key);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.value.push({
                    key,
                    name: selectedProduct.value.name,
                    variant: variantLabel,
                    option: optionLabel,
                    price,
                    qty: 1,
                    type: selectedProduct.value.subcategory || selectedProduct.value.type || ''
                });
            }

            // Cierra el modal del producto pero deja el carrito cerrado hasta que el usuario haga click en el icono
            closeProduct();
        };

        // Cambiar cantidad
        const increaseQty = (item) => { item.qty += 1; };
        const decreaseQty = (item) => {
            if (item.qty > 1) item.qty -= 1;
            else removeFromCart(item);
        };
        const removeFromCart = (item) => {
            cart.value = cart.value.filter(i => i.key !== item.key);
        };

        const clearCart = () => {
            askClearCart();
        };

        const clearCartModalOpen = ref(false);

        const askClearCart = () => {
            if (!cart.value.length) return;
            clearCartModalOpen.value = true;
        };

        const cancelClearCart = () => {
            clearCartModalOpen.value = false;
        };

        const confirmClearCart = () => {
            cart.value = [];
            clearCartModalOpen.value = false;
            orderSent.value = false;
            pendingOrderPayload.value = null;
        };

        // Abrir/cerrar drawer
        const openCart = () => {
            cartOpen.value = true;
            document.body.classList.add('menu-lock-scroll');
            if (currentUser.value && !currentUser.value.is_anonymous) {
                loadProfileDefaults();
            }
        }; const closeCart = () => { cartOpen.value = false; document.body.classList.remove('menu-lock-scroll'); };
        const toggleCart = () => cartOpen.value ? closeCart() : openCart();

        // Si el usuario vacía el carrito o cierra el drawer sin confirmar, reseteamos
        watch(cartOpen, (open) => {
            if (!open) {
                orderSent.value = false;
                pendingOrderPayload.value = null;
            }
        });

        // Mensaje completo de WhatsApp con todo el pedido
        const cartWhatsappLink = computed(() => {
            if (!cart.value.length) return '#';

            const lines = ['Hola SENDA 🍣, quiero hacer el siguiente pedido:', ''];

            cart.value.forEach((item, idx) => {
                const parts = [`${idx + 1}. ${item.qty}x ${item.name}`];
                if (item.variant) parts.push(`(${item.variant})`);
                if (item.option) parts.push(`- ${item.option}`);
                parts.push(`→ ${item.price} c/u`);
                lines.push(parts.join(' '));
            });

            lines.push('');
            lines.push(`Subtotal estimado: ${formatPrice(cartSubtotal.value)}`);
            lines.push('');
            lines.push('¡Gracias!');

            const text = lines.join('\n');
            return CONFIG.getWhatsappLink
                ? CONFIG.getWhatsappLink(text)
                : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
        });
        // ----- Autoplay del carrusel de reviews -----
        const stopReviewAutoplay = () => {
            if (reviewAutoplay) {
                clearInterval(reviewAutoplay);
                reviewAutoplay = null;
            }
        };

        let reviewAutoplayTicking = false;

        const startReviewAutoplay = () => {
            stopReviewAutoplay();
            if (totalReviewPages.value <= 1) return;
            reviewAutoplay = setInterval(() => {
                reviewAutoplayTicking = true;
                const max = totalReviewPages.value - 1;
                reviewPage.value = reviewPage.value >= max ? 0 : reviewPage.value + 1;
                reviewAutoplayTicking = false;
            }, reviewAutoplayInterval);
        };

        const pauseReviewAutoplayTemporarily = () => {
            if (reviewAutoplayTicking) return; // ignorar si viene del propio autoplay
            stopReviewAutoplay();
            if (reviewAutoplayResume) clearTimeout(reviewAutoplayResume);
            reviewAutoplayResume = setTimeout(() => {
                startReviewAutoplay();
            }, 8000);
        };

        const truncateText = (text, max) => {
            if (!text) return '';
            const clean = text.replace(/\s+/g, ' ').trim();
            if (clean.length <= max) return clean;
            return clean.slice(0, max).trim() + '…';
        };

        const loadReviews = async () => {
            try {
                if (window.SENDA_REVIEWS) {
                    reviews.value = window.SENDA_REVIEWS.reviews.map(r => ({
                        ...r,
                        starsNumber: parseInt((r.stars || '').replace(/\D/g, ''), 10) || 0
                    }));
                    reviewsLoaded.value = true;
                    updateReviewsPerView();
                    setTimeout(startReviewAutoplay, 300); // 👈 nuevo
                    return;
                }

                const res = await fetch('senda-sushi-reviews-full.json');
                if (!res.ok) throw new Error('No se pudo cargar el JSON');
                const data = await res.json();
                reviews.value = (data.reviews || []).map(r => ({
                    ...r,
                    starsNumber: parseInt((r.stars || '').replace(/\D/g, ''), 10) || 0
                }));
                reviewsLoaded.value = true;
                updateReviewsPerView();
                setTimeout(startReviewAutoplay, 300); // 👈 nuevo
            } catch (err) {
                console.error('Error cargando reviews:', err);
                reviewsLoaded.value = true;
            }
        };

        onMounted(() => {
            initAuth();
            loadReviews();
            updateReviewsPerView();
            window.addEventListener('resize', updateReviewsPerView);

            console.log('🚀 onMounted - selectedProduct inicial:', selectedProduct.value);
            console.log('🚀 onMounted - isModalOpen inicial:', isModalOpen.value);

            window.addEventListener('scroll', () => {
                scrolled.value = window.scrollY > 50;
            });
            startAutoplay();

            selectedProduct.value = null;
            isModalOpen.value = false;
            console.log('✅ Forzado selectedProduct a null:', selectedProduct.value);
            console.log('✅ Forzado isModalOpen a false:', isModalOpen.value);

            // ✅ Habilitar clicks de productos SOLO después de que el DOM esté estable.
            // Usamos doble rAF + setTimeout para asegurarnos de que cualquier
            // evento sintético disparado durante el renderizado ya haya pasado.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        isPageReady.value = true;
                        console.log('🔓 isPageReady = true · clicks de productos habilitados');
                    }, 400);
                });
            });

            // Arrancar autoplay de reviews cuando terminen de cargarse
            watch(totalReviewPages, (n) => {
                if (n > 1) {
                    startReviewAutoplay();
                } else {
                    stopReviewAutoplay();
                }
            });

            if (new URLSearchParams(window.location.search).get('reset') === '1') {
                showResetForm.value = true;
            }

            const updatePassword = async () => {
                const { error } = await sb.auth.updateUser({ password: newPassword.value });
                if (error) authError.value = error.message;
                else {
                    authMessage.value = 'Contraseña actualizada. Ya podés iniciar sesión.';
                    showResetForm.value = false;
                }
            };
        });

        onUnmounted(() => {
            if (sb) sb.auth.onAuthStateChange(() => { }); // opcional: limpiar
            loadCartFromStorage();

            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }

            window.removeEventListener('resize', updateReviewsPerView);

            stopReviewAutoplay();
            if (reviewAutoplayResume) clearTimeout(reviewAutoplayResume);
        });

        return {
            scrolled,
            isPageReady,
            modalVisible,
            whatsappLink,
            googleMapsLink,

            // Menu redesign
            selectedCategory,
            menuSearch,
            showFilterPanel,
            activeFeatureFilters,
            openAccordions,
            expandedCategories,
            selectedProduct,
            isModalOpen,
            selectedOption,
            categories,
            availableFlags,
            visibleCategoryGroups,
            totalVisibleProducts,
            searchResultCount,
            productPreviewLimit,
            productWhatsappLink,
            selectedProductPrice,
            selectedVariantLabel,
            selectVariant,
            selectCategory,
            toggleAccordion,
            toggleCategoryExpanded,
            toggleFeatureFilter,
            clearMenuSearch,
            clearAllFilters,
            openProduct,
            closeProduct,
            getFlagClass,

            // Existing site state
            menuCategories,
            carouselImages,
            menuItems,
            schedules,
            socialLinks,
            mobileMenuOpen,
            mobileMenuDropdownOpen,
            currentSlide,
            toggleMobileMenu,
            toggleMobileMenuDropdown,
            closeMobileMenu,
            scrollToCategory,
            nextSlide,
            prevSlide,
            goToSlide,

            // Reviews
            reviews,
            reviewsLoaded,
            reviewPage,
            reviewPages,
            totalReviewPages,
            filteredReviews,
            averageRating,
            nextReviewPage,
            prevReviewPage,
            goToReviewPage,
            truncateText,
            mobileDots,
            startReviewAutoplay,
            stopReviewAutoplay,

            // Cart
            cart,
            cartOpen,
            cartTotalItems,
            cartSubtotal,
            cartWhatsappLink,
            addToCart,
            increaseQty,
            decreaseQty,
            removeFromCart,
            clearCart,
            clearCartModalOpen,
            askClearCart,
            cancelClearCart,
            confirmClearCart,
            openCart,
            closeCart,
            toggleCart,
            formatPrice,

            // Auth
            currentUser,
            authModalOpen,
            userMenuOpen,
            authEmail,
            authLoading,
            authMessage,
            authError,
            openAuthModal,
            closeAuthModal,
            toggleUserMenu,
            closeUserMenu,
            // signInWithGoogle,
            signInWithMagicLink,
            signOut,
            ordersModalOpen,
            ordersModalVisible,
            openOrdersModal,
            closeOrdersModal,
            authPassword,
            isRegistering,
            useMagicLink,
            handlePasswordAuth,
            resetPassword,
            // confirmOrderSaved,

            // Orders
            myOrders,
            submittingOrder,
            orderError,
            checkout,
            sendOrderViaWhatsapp,
            // confirmOrderSaved,
            statusLabel,
            statusClass,
            orderSent,
            sendOrderViaWhatsapp,
            // confirmOrderSaved,
        };
    }
});

// Montar la aplicación
app.mount('#app');