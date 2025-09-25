// Main Application Controller
import { auth } from './auth.js';
import { api, handleApiError } from './api.js';
import { ui } from './ui.js';
import { router } from './router.js';

class Application {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('EduConnect: Initializing application...');
            
            // Setup error handling
            this.setupGlobalErrorHandling();
            
            // Setup application-wide event listeners
            this.setupApplicationEvents();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup accessibility features
            this.setupAccessibility();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.startApplication();
                });
            } else {
                this.startApplication();
            }
            
        } catch (error) {
            console.error('Application initialization failed:', error);
            this.handleCriticalError(error);
        }
    }

    async startApplication() {
        try {
            console.log('EduConnect: Starting application...');
            
            // Check browser compatibility
            if (!this.checkBrowserCompatibility()) {
                return;
            }
            
            // Initialize modules in order
            await this.initializeModules();
            
            // Setup service worker (if needed in future)
            // await this.setupServiceWorker();
            
            this.isInitialized = true;
            console.log('EduConnect: Application ready!');
            
            // Analytics event (if analytics added in future)
            this.trackEvent('app_initialized');
            
        } catch (error) {
            console.error('Application startup failed:', error);
            this.handleCriticalError(error);
        }
    }

    async initializeModules() {
        // Auth module is already initialized
        // UI module is already initialized 
        // Router module is already initialized and handles the initial route
        
        // Subscribe to auth changes for application-wide updates
        auth.addListener((authState) => {
            this.handleAuthStateChange(authState);
        });
    }

    checkBrowserCompatibility() {
        const requiredFeatures = [
            'fetch',
            'localStorage',
            'addEventListener',
            'querySelector',
            'classList',
            'Promise',
            'CustomEvent'
        ];

        const unsupportedFeatures = requiredFeatures.filter(feature => {
            if (feature === 'fetch') return !window.fetch;
            if (feature === 'localStorage') return !window.localStorage;
            if (feature === 'Promise') return !window.Promise;
            if (feature === 'CustomEvent') return !window.CustomEvent;
            return !window[feature];
        });

        if (unsupportedFeatures.length > 0) {
            const message = `Seu navegador não suporta alguns recursos necessários: ${unsupportedFeatures.join(', ')}. Por favor, atualize seu navegador.`;
            this.showBrowserCompatibilityWarning(message);
            return false;
        }

        return true;
    }

    showBrowserCompatibilityWarning(message) {
        document.body.innerHTML = `
            <div style="
                padding: 2rem;
                text-align: center;
                background-color: #f8f9fa;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <h1 style="color: #dc3545; margin-bottom: 1rem;">Navegador não compatível</h1>
                <p style="max-width: 500px; margin-bottom: 2rem; color: #333;">${message}</p>
                <p style="color: #666;">Recomendamos usar Chrome, Firefox, Safari ou Edge atualizados.</p>
            </div>
        `;
    }

    setupGlobalErrorHandling() {
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Prevent the default browser behavior
            event.preventDefault();
            
            // Show user-friendly error message
            ui.showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
            
            // Track error for debugging
            this.trackError('unhandled_promise_rejection', event.reason);
        });

        // Global JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            
            // Show user-friendly error message for critical errors
            if (event.error && event.error.stack && event.error.stack.includes('app.js')) {
                ui.showToast('Erro crítico da aplicação. Recarregue a página.', 'error');
            }
            
            // Track error for debugging
            this.trackError('javascript_error', event.error);
        });

        // Handle API errors globally
        window.addEventListener('api:error', (event) => {
            const error = event.detail;
            console.warn('API Error:', error);
            
            // Handle specific error cases
            if (error.status === 401) {
                // Unauthorized - handled by auth module
                return;
            }
            
            if (error.status >= 500) {
                ui.showToast('Problema no servidor. Tente novamente em alguns minutos.', 'error');
            }
        });
    }

    setupApplicationEvents() {
        // Handle network status changes
        window.addEventListener('online', () => {
            ui.showToast('Conexão restabelecida!', 'success');
            this.trackEvent('network_online');
        });

        window.addEventListener('offline', () => {
            ui.showToast('Sem conexão com a internet', 'warning', 10000);
            this.trackEvent('network_offline');
        });

        // Handle visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab is hidden - pause non-essential operations
                this.pauseBackgroundTasks();
            } else {
                // Tab is visible - resume operations
                this.resumeBackgroundTasks();
            }
        });

        // Handle before unload (user leaving page)
        window.addEventListener('beforeunload', (event) => {
            // Clean up resources
            this.cleanup();
        });

        // Handle focus events for accessibility
        document.addEventListener('focusin', (event) => {
            // Ensure focused elements are visible
            const element = event.target;
            if (element && element.scrollIntoView) {
                setTimeout(() => {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }, 100);
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window && 'measure' in window.performance) {
            // Mark application start
            performance.mark('app-start');
            
            // Measure initialization time
            window.addEventListener('load', () => {
                performance.mark('app-loaded');
                performance.measure('app-init-time', 'app-start', 'app-loaded');
                
                const measure = performance.getEntriesByName('app-init-time')[0];
                console.log(`Application initialization time: ${measure.duration}ms`);
                
                this.trackPerformance('app_init_time', measure.duration);
            });
        }

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            const logMemoryUsage = () => {
                const memory = performance.memory;
                console.log('Memory usage:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
                });
            };

            // Log memory usage periodically in development
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('replit')) {
                setInterval(logMemoryUsage, 30000); // Every 30 seconds
            }
        }
    }

    setupAccessibility() {
        // Enhance keyboard navigation
        document.addEventListener('keydown', (event) => {
            // Skip links functionality
            if (event.key === 'Tab' && !event.shiftKey && event.target === document.body) {
                const firstFocusable = document.querySelector('main a, main button, main input, main select, main textarea');
                if (firstFocusable) {
                    firstFocusable.focus();
                    event.preventDefault();
                }
            }
        });

        // Add skip link for screen readers
        this.addSkipLink();

        // Announce route changes to screen readers
        window.addEventListener('router:navigate', (event) => {
            const path = event.detail.path;
            const pageName = this.getPageNameFromPath(path);
            
            setTimeout(() => {
                ui.announceToScreenReader(`Navegou para ${pageName}`);
            }, 500);
        });

        // Handle focus management for modals
        window.addEventListener('ui:modal', (event) => {
            if (event.detail.action === 'show') {
                // Focus will be managed by UI module
            } else if (event.detail.action === 'hide') {
                // Return focus to trigger element if available
                const lastFocused = document.querySelector('[data-modal-trigger]');
                if (lastFocused) {
                    lastFocused.focus();
                }
            }
        });
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #0066cc;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 9999;
            font-size: 14px;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const app = document.getElementById('app');
        if (app) {
            app.setAttribute('role', 'main');
            app.setAttribute('id', 'main-content');
        }
    }

    getPageNameFromPath(path) {
        const pageNames = {
            '/': 'Início',
            '/login': 'Login',
            '/register': 'Criar Conta',
            '/dashboard': 'Dashboard'
        };

        if (path.startsWith('/group/')) {
            return 'Página do Grupo';
        }

        return pageNames[path] || 'Página';
    }

    handleAuthStateChange(authState) {
        this.currentUser = authState.user;
        
        // Update UI based on auth state
        if (authState.isAuthenticated && authState.user) {
            // User logged in
            this.onUserLogin(authState.user);
        } else if (!authState.isAuthenticated && this.currentUser) {
            // User logged out
            this.onUserLogout();
        }
    }

    onUserLogin(user) {
        console.log('User logged in:', user.name);
        this.trackEvent('user_login', { user_id: user.id });
        
        // Update any global UI elements that show user info
        this.updateGlobalUserInfo(user);
    }

    onUserLogout() {
        console.log('User logged out');
        this.trackEvent('user_logout');
        
        // Clean up user-specific data
        this.cleanupUserData();
    }

    updateGlobalUserInfo(user) {
        // Update any global elements that show user information
        // This would be used for persistent headers, etc.
    }

    cleanupUserData() {
        // Clean up any cached user data, stop polling, etc.
        ui.stopChatPolling();
    }

    pauseBackgroundTasks() {
        // Pause any background polling or timers when tab is hidden
        ui.stopChatPolling();
    }

    resumeBackgroundTasks() {
        // Resume background tasks when tab becomes visible
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/group/')) {
            const groupId = currentPath.split('/')[2];
            if (groupId) {
                ui.startChatPolling(groupId);
            }
        }
    }

    // Health check for the application
    async healthCheck() {
        try {
            const response = await api.healthCheck();
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    // Error handling
    handleCriticalError(error) {
        console.error('Critical application error:', error);
        
        // Show critical error UI
        document.body.innerHTML = `
            <div style="
                padding: 2rem;
                text-align: center;
                background-color: #f8f9fa;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <h1 style="color: #dc3545; margin-bottom: 1rem;">Erro Crítico</h1>
                <p style="max-width: 500px; margin-bottom: 2rem; color: #333;">
                    Ocorreu um erro crítico na aplicação. Por favor, recarregue a página.
                </p>
                <button onclick="window.location.reload()" style="
                    background: #0066cc;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                ">
                    Recarregar Página
                </button>
            </div>
        `;
        
        this.trackError('critical_error', error);
    }

    // Analytics/tracking methods (placeholder for future analytics integration)
    trackEvent(eventName, properties = {}) {
        console.log('Event:', eventName, properties);
        
        // Future: Send to analytics service
        // analytics.track(eventName, properties);
    }

    trackError(errorType, error) {
        console.error('Tracked error:', errorType, error);
        
        // Future: Send to error tracking service
        // errorTracking.captureException(error, { tags: { type: errorType } });
    }

    trackPerformance(metricName, value) {
        console.log('Performance metric:', metricName, value);
        
        // Future: Send to performance monitoring service
        // performance.track(metricName, value);
    }

    // Cleanup
    cleanup() {
        console.log('Cleaning up application...');
        
        // Stop all timers and intervals
        ui.cleanup();
        
        // Clear any cached data if needed
        // localStorage.removeItem('temp_data');
        
        this.isInitialized = false;
    }

    // Public API for debugging
    getApplicationInfo() {
        return {
            isInitialized: this.isInitialized,
            currentUser: this.currentUser,
            currentRoute: router.currentRoute,
            authState: {
                isAuthenticated: auth.isAuthenticated,
                isLoading: auth.isLoading
            },
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                online: navigator.onLine
            }
        };
    }
}

// Initialize the application
const app = new Application();

// Expose app for debugging in development
if (window.location.hostname === 'localhost' || window.location.hostname.includes('replit')) {
    window.EduConnect = {
        app,
        auth,
        api,
        ui,
        router,
        debug: {
            getInfo: () => app.getApplicationInfo(),
            healthCheck: () => app.healthCheck(),
            triggerError: () => { throw new Error('Test error'); }
        }
    };
    
    console.log('EduConnect debug interface available at window.EduConnect');
}

// Make available globally and export for modules
window.app = app;

export { app };