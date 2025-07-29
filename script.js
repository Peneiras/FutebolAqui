/**
 * PeneirasBR - JavaScript Modificado para Google Ads
 * Versão com links diretos - sem lógica de redirecionamento JavaScript
 * Compatível com políticas do Google Ads
 */

(function() {
    'use strict';

    // Configurações globais
    const CONFIG = {
        animationDuration: 300,
        scrollOffset: 80,
        debounceDelay: 250
    };

    // Utilitários
    const Utils = {
        // Debounce function para otimizar performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Smooth scroll seguro
        smoothScroll: function(target, offset = 0) {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (!element) return;

            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },

        // Animação de números
        animateNumber: function(element, target, duration = 2000) {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current).toLocaleString('pt-BR');
            }, 16);
        },

        // Sanitização de entrada
        sanitizeInput: function(input) {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        }
    };

    // Gerenciador de Notificações
    const NotificationManager = {
        container: null,

        init: function() {
            this.container = document.getElementById('notification-container');
        },

        show: function(message, type = 'info', duration = 5000) {
            if (!this.container) return;

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-message">${Utils.sanitizeInput(message)}</span>
                    <button class="notification-close" aria-label="Fechar notificação">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Event listener para fechar
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.hide(notification);
            });

            // Adicionar à container
            this.container.appendChild(notification);

            // Auto-hide após duração especificada
            setTimeout(() => {
                this.hide(notification);
            }, duration);

            // Animar entrada
            setTimeout(() => {
                notification.classList.add('notification-show');
            }, 10);
        },

        hide: function(notification) {
            notification.classList.remove('notification-show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, CONFIG.animationDuration);
        }
    };

    // Navegação
    const Navigation = {
        nav: null,
        navToggle: null,
        navMenu: null,
        isMenuOpen: false,

        init: function() {
            this.nav = document.querySelector('.nav');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.querySelector('.nav-menu');

            this.bindEvents();
            this.handleScroll();
        },

        bindEvents: function() {
            // Toggle do menu mobile
            if (this.navToggle) {
                this.navToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMenu();
                });
            }

            // Links de navegação
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = link.getAttribute('href');
                    Utils.smoothScroll(target, CONFIG.scrollOffset);
                    
                    // Fechar menu mobile se estiver aberto
                    if (this.isMenuOpen) {
                        this.toggleMenu();
                    }
                });
            });

            // Scroll para alterar estilo da navegação
            window.addEventListener('scroll', Utils.debounce(() => {
                this.handleScroll();
            }, CONFIG.debounceDelay));

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !this.nav.contains(e.target)) {
                    this.toggleMenu();
                }
            });

            // Fechar menu com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.toggleMenu();
                }
            });
        },

        toggleMenu: function() {
            this.isMenuOpen = !this.isMenuOpen;
            
            if (this.navToggle) {
                this.navToggle.classList.toggle('nav-toggle-active');
                this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
            }
            
            if (this.navMenu) {
                this.navMenu.classList.toggle('nav-menu-active');
            }

            // Prevenir scroll do body quando menu estiver aberto
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        },

        handleScroll: function() {
            const scrollY = window.scrollY;
            
            if (this.nav) {
                if (scrollY > 100) {
                    this.nav.classList.add('nav-scrolled');
                } else {
                    this.nav.classList.remove('nav-scrolled');
                }
            }
        }
    };

    // Animações de Scroll
    const ScrollAnimations = {
        elements: [],

        init: function() {
            this.elements = document.querySelectorAll('[data-animate]');
            this.bindEvents();
            this.checkVisibility();
        },

        bindEvents: function() {
            window.addEventListener('scroll', Utils.debounce(() => {
                this.checkVisibility();
            }, CONFIG.debounceDelay));
        },

        checkVisibility: function() {
            this.elements.forEach(element => {
                if (this.isInViewport(element)) {
                    element.classList.add('animate-in');
                }
            });
        },

        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    // Contadores Animados
    const AnimatedCounters = {
        counters: [],
        hasAnimated: false,

        init: function() {
            this.counters = document.querySelectorAll('.stat-number[data-target]');
            this.bindEvents();
        },

        bindEvents: function() {
            window.addEventListener('scroll', Utils.debounce(() => {
                this.checkAndAnimate();
            }, CONFIG.debounceDelay));
        },

        checkAndAnimate: function() {
            if (this.hasAnimated) return;

            const heroStats = document.querySelector('.hero-stats');
            if (!heroStats) return;

            const rect = heroStats.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                this.animateCounters();
                this.hasAnimated = true;
            }
        },

        animateCounters: function() {
            this.counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                Utils.animateNumber(counter, target, 2500);
            });
        }
    };

    // Gerenciador de Modais
    const ModalManager = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Fechar modais ao clicar fora
            window.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    this.closeModal(e.target.id);
                }
            });

            // Fechar modais com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const openModal = document.querySelector('.modal[style*="block"]');
                    if (openModal) {
                        this.closeModal(openModal.id);
                    }
                }
            });
        },

        openModal: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        },

        closeModal: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    };

    // Botão Voltar ao Topo
    const BackToTop = {
        button: null,

        init: function() {
            this.button = document.getElementById('back-to-top');
            this.bindEvents();
        },

        bindEvents: function() {
            if (!this.button) return;

            // Mostrar/ocultar baseado no scroll
            window.addEventListener('scroll', Utils.debounce(() => {
                this.toggleVisibility();
            }, CONFIG.debounceDelay));

            // Click para voltar ao topo
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.smoothScroll('body');
            });
        },

        toggleVisibility: function() {
            const scrollY = window.scrollY;
            const shouldShow = scrollY > 300;

            if (shouldShow) {
                this.button.style.display = 'flex';
                setTimeout(() => {
                    this.button.classList.add('back-to-top-visible');
                }, 10);
            } else {
                this.button.classList.remove('back-to-top-visible');
                setTimeout(() => {
                    if (!this.button.classList.contains('back-to-top-visible')) {
                        this.button.style.display = 'none';
                    }
                }, CONFIG.animationDuration);
            }
        }
    };

    // Acessibilidade
    const AccessibilityManager = {
        init: function() {
            this.handleKeyboardNavigation();
            this.handleFocusManagement();
            this.addSkipLinks();
        },

        handleKeyboardNavigation: function() {
            // Navegação por teclado para elementos interativos
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const target = e.target;
                    // REMOVIDO: lógica para suggestion-btn, search-button e cta-button
                    // Agora esses elementos são links diretos no HTML
                }
            });
        },

        handleFocusManagement: function() {
            // Melhorar indicadores de foco
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },

        addSkipLinks: function() {
            // Skip links já estão no HTML, apenas garantir funcionamento
            const skipLink = document.querySelector('.skip-to-main');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById('main-content');
                    if (target) {
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    };

    // Performance Monitor
    const PerformanceMonitor = {
        init: function() {
            this.monitorPageLoad();
            this.monitorUserInteractions();
        },

        monitorPageLoad: function() {
            window.addEventListener('load', () => {
                // Log de performance (apenas em desenvolvimento)
                if (window.performance && console.log) {
                    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                    console.log(`Página carregada em ${loadTime}ms`);
                }
            });
        },

        monitorUserInteractions: function() {
            // Monitorar cliques em elementos importantes
            document.addEventListener('click', (e) => {
                const target = e.target.closest('[data-track]');
                if (target) {
                    const action = target.getAttribute('data-track');
                    // Em produção, enviaria dados para analytics
                    console.log(`Ação rastreada: ${action}`);
                }
            });
        }
    };

    // Inicialização Principal
    const App = {
        init: function() {
            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeModules();
                });
            } else {
                this.initializeModules();
            }
        },

        initializeModules: function() {
            try {
                // Inicializar todos os módulos
                NotificationManager.init();
                Navigation.init();
                ScrollAnimations.init();
                AnimatedCounters.init();
                // REMOVIDO: ContactManager (não é mais necessário)
                ModalManager.init();
                BackToTop.init();
                AccessibilityManager.init();
                PerformanceMonitor.init();

                // Indicar que a aplicação foi inicializada
                document.body.classList.add('app-initialized');
                
                console.log('PeneirasBR inicializado com sucesso!');
            } catch (error) {
                console.error('Erro na inicialização:', error);
                if (NotificationManager.show) {
                    NotificationManager.show('Erro na inicialização da aplicação', 'error');
                }
            }
        }
    };

    // Funções globais para modais (chamadas pelo HTML)
    window.showPrivacyPolicy = function() {
        const modal = document.getElementById('privacy-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    window.showTerms = function() {
        const modal = document.getElementById('terms-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    window.showFAQ = function() {
        const modal = document.getElementById('faq-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Inicializar aplicação
    App.init();

    // Expor utilitários globalmente se necessário (apenas para debug)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.PeneirasBR = {
            Utils,
            NotificationManager
        };
    }

})();
