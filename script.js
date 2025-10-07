// Marketing Funnel JavaScript
// Real Estate License Course - Mexico

class MarketingFunnel {
    constructor() {
        this.currentPage = 'landing-page';
        this.userData = {
            name: '',
            email: '',
            state: '',
            phone: '',
            webinarDate: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
        this.setupPaymentMethods();
        this.startEmailSequence();
        this.startCountdownTimer();
    }

    bindEvents() {
        // Lead form submission
        const leadForm = document.getElementById('lead-form');
        if (leadForm) {
            leadForm.addEventListener('submit', (e) => this.handleLeadSubmission(e));
        }

        // Webinar form submission
        const webinarForm = document.getElementById('webinar-form');
        if (webinarForm) {
            webinarForm.addEventListener('submit', (e) => this.handleWebinarSubmission(e));
        }

        // Checkout form submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmission(e));
        }

        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => this.handlePaymentMethodChange(e));
        });

        // Card number formatting
        const cardNumber = document.getElementById('card-number');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Card expiry formatting
        const cardExpiry = document.getElementById('card-expiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => this.formatCardExpiry(e));
        }

        // CVV formatting
        const cardCvv = document.getElementById('card-cvv');
        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => this.formatCardCvv(e));
        }

        // Module start buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="startModule"]')) {
                e.preventDefault();
                const moduleNum = e.target.getAttribute('onclick').match(/\d+/)[0];
                this.startModule(moduleNum);
            }
        });
    }

    setupFormValidation() {
        // Real-time form validation
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupPaymentMethods() {
        // Show/hide card fields based on payment method
        const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
        paymentMethodInputs.forEach(input => {
            input.addEventListener('change', () => {
                const cardFields = document.getElementById('card-fields');
                if (cardFields) {
                    if (input.value === 'tarjeta') {
                        cardFields.classList.add('active');
                    } else {
                        cardFields.classList.remove('active');
                    }
                }
            });
        });
    }

    // Page Navigation
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            
            // Scroll to top
            window.scrollTo(0, 0);

            // Track page view
            this.trackPageView(pageId);
        }
    }

    showLanding() {
        this.showPage('landing-page');
    }

    showWebinar() {
        this.showPage('webinar-page');
    }

    showSales() {
        this.showPage('sales-page');
    }

    showCheckout() {
        this.showPage('checkout-page');
    }

    showThankYou() {
        this.showPage('thank-you-page');
    }

    showCourseAccess() {
        this.showPage('course-access-page');
    }

    // Form Handlers
    handleLeadSubmission(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            state: document.getElementById('estado').value
        };

        if (this.validateForm(formData)) {
            this.userData = { ...this.userData, ...formData };
            this.simulateLeadCapture(formData);
            this.showSuccessMessage('¡Gracias! Tu guía gratuita será enviada a tu email.');
            
            // Show webinar invitation after 3 seconds
            setTimeout(() => {
                this.showWebinarInvitation();
            }, 3000);
        }
    }

    handleWebinarSubmission(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('webinar-nombre').value,
            email: document.getElementById('webinar-email').value,
            phone: document.getElementById('webinar-telefono').value,
            state: document.getElementById('webinar-estado').value,
            webinarDate: document.getElementById('webinar-fecha').value
        };

        if (this.validateForm(formData)) {
            this.userData = { ...this.userData, ...formData };
            this.simulateWebinarRegistration(formData);
            this.showSuccessMessage('¡Registro exitoso! Te enviaremos el enlace del webinar por email.');
            
            // Redirect to sales page after 3 seconds
            setTimeout(() => {
                this.showSales();
            }, 3000);
        }
    }

    handleCheckoutSubmission(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('billing-nombre').value,
            email: document.getElementById('billing-email').value,
            phone: document.getElementById('billing-telefono').value,
            address: document.getElementById('billing-direccion').value,
            city: document.getElementById('billing-ciudad').value,
            postalCode: document.getElementById('billing-cp').value,
            state: document.getElementById('billing-estado').value,
            rfc: document.getElementById('billing-rfc').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value
        };

        if (this.validateCheckoutForm(formData)) {
            this.userData = { ...this.userData, ...formData };
            this.simulatePurchase(formData);
            this.showSuccessMessage('¡Compra exitosa! Redirigiendo a tu área de membresía...');
            
            // Redirect to thank you page after 2 seconds
            setTimeout(() => {
                this.showThankYou();
            }, 2000);
        }
    }

    handlePaymentMethodChange(e) {
        const cardFields = document.getElementById('card-fields');
        if (cardFields) {
            if (e.target.value === 'tarjeta') {
                cardFields.classList.add('active');
            } else {
                cardFields.classList.remove('active');
            }
        }
    }

    // Form Validation
    validateForm(data) {
        let isValid = true;

        if (!data.name || data.name.length < 2) {
            this.showFieldError('nombre', 'Por favor ingresa tu nombre completo');
            isValid = false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Por favor ingresa un email válido');
            isValid = false;
        }

        if (!data.state) {
            this.showFieldError('estado', 'Por favor selecciona tu estado');
            isValid = false;
        }

        return isValid;
    }

    validateCheckoutForm(data) {
        let isValid = this.validateForm(data);

        if (!data.address || data.address.length < 10) {
            this.showFieldError('billing-direccion', 'Por favor ingresa tu dirección completa');
            isValid = false;
        }

        if (!data.city || data.city.length < 2) {
            this.showFieldError('billing-ciudad', 'Por favor ingresa tu ciudad');
            isValid = false;
        }

        if (!data.postalCode || !/^\d{5}$/.test(data.postalCode)) {
            this.showFieldError('billing-cp', 'Por favor ingresa un código postal válido');
            isValid = false;
        }

        const terms = document.getElementById('terms');
        if (!terms.checked) {
            this.showFieldError('terms', 'Debes aceptar los términos y condiciones');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un email válido';
                }
                break;
            case 'tel':
                if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un teléfono válido';
                }
                break;
            default:
                if (field.required && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Este campo es requerido';
                }
        }

        if (!isValid) {
            this.showFieldError(field.id, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#dc2626';
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }

            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#dc2626';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '0.5rem';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.style.borderColor = '#e2e8f0';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Card Formatting
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substr(0, 19);
        }
        e.target.value = formattedValue;
    }

    formatCardExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    formatCardCvv(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    // Utility Functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 600;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Simulation Functions
    simulateLeadCapture(data) {
        console.log('Lead captured:', data);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Lead sent to email service');
        }, 1000);
    }

    simulateWebinarRegistration(data) {
        console.log('Webinar registration:', data);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Webinar registration confirmed');
        }, 1000);
    }

    simulatePurchase(data) {
        console.log('Purchase completed:', data);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Purchase processed successfully');
        }, 1000);
    }

    // Course Module Functions
    startModule(moduleNumber) {
        // Simulate starting a module
        const moduleCard = document.querySelector(`[onclick*="startModule(${moduleNumber})"]`).closest('.module-card');
        if (moduleCard) {
            moduleCard.classList.remove('locked');
            
            // Update module status
            const statusElement = moduleCard.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'En Progreso';
                statusElement.className = 'status in-progress';
                statusElement.style.background = '#dbeafe';
                statusElement.style.color = '#1e40af';
            }

            // Enable first lesson
            const firstLesson = moduleCard.querySelector('.lesson');
            if (firstLesson) {
                firstLesson.classList.remove('locked');
                const icon = firstLesson.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-play-circle';
                    icon.style.color = '#2563eb';
                }
            }

            this.showSuccessMessage(`¡Módulo ${moduleNumber} iniciado! Puedes comenzar con la primera lección.`);
        }
    }

    showUpsells() {
        // Show upsell modal or redirect to upsell page
        this.showSuccessMessage('Próximamente: Opciones premium disponibles');
    }

    // Email Sequence Simulation
    startEmailSequence() {
        // Simulate email sequence for lead nurturing
        if (this.userData.email) {
            setTimeout(() => {
                console.log('Email 1 sent: Welcome email');
            }, 1000);

            setTimeout(() => {
                console.log('Email 2 sent: Value email - 3 easiest states');
            }, 2 * 24 * 60 * 60 * 1000); // 2 days

            setTimeout(() => {
                console.log('Email 3 sent: Authority email - instructor story');
            }, 4 * 24 * 60 * 60 * 1000); // 4 days

            setTimeout(() => {
                console.log('Email 4 sent: Urgency email - special offer');
            }, 6 * 24 * 60 * 60 * 1000); // 6 days
        }
    }

    showWebinarInvitation() {
        // Show webinar invitation modal
        const modal = document.createElement('div');
        modal.className = 'webinar-invitation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; text-align: center; margin: 1rem;">
                <h3 style="color: #1e293b; margin-bottom: 1rem;">🎉 ¡Excelente!</h3>
                <p style="color: #64748b; margin-bottom: 1.5rem;">Tu guía gratuita ha sido enviada a tu email. ¿Te gustaría asistir a nuestro webinar gratuito?</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="this.closest('.webinar-invitation-modal').remove(); funnel.showWebinar();" 
                            style="background: #2563eb; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        ¡Sí, Quiero Asistir!
                    </button>
                    <button onclick="this.closest('.webinar-invitation-modal').remove();" 
                            style="background: #64748b; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer;">
                        Tal Vez Después
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Analytics and Tracking
    trackPageView(pageId) {
        console.log(`Page view: ${pageId}`);
        
        // Track conversion funnel
        const funnelSteps = {
            'landing-page': 1,
            'webinar-page': 2,
            'sales-page': 3,
            'checkout-page': 4,
            'thank-you-page': 5,
            'course-access-page': 6
        };

        const step = funnelSteps[pageId];
        if (step) {
            console.log(`Funnel step ${step}: ${pageId}`);
        }
    }

    // Quiz Functionality (for lead segmentation)
    showQuiz() {
        const quizModal = document.createElement('div');
        quizModal.className = 'quiz-modal';
        quizModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        quizModal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 600px; margin: 1rem;">
                <h3 style="color: #1e293b; margin-bottom: 1.5rem;">¿Qué Tipo de Agente Inmobiliario Serás?</h3>
                <div style="text-align: center;">
                    <p style="color: #64748b; margin-bottom: 1.5rem;">Descubre tu perfil ideal y recibe recomendaciones personalizadas</p>
                    <button onclick="this.closest('.quiz-modal').remove(); funnel.showQuizQuestions();" 
                            style="background: #2563eb; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Comenzar Quiz
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(quizModal);
    }

    showQuizQuestions() {
        // Implementation for quiz questions
        this.showSuccessMessage('Quiz en desarrollo - Próximamente disponible');
    }

    // Chatbot Simulation
    showChatbot() {
        const chatbot = document.createElement('div');
        chatbot.className = 'chatbot-widget';
        chatbot.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            height: 400px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            z-index: 1500;
            display: flex;
            flex-direction: column;
        `;

        chatbot.innerHTML = `
            <div style="background: #2563eb; color: white; padding: 1rem; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0;">💬 Soporte</h4>
                <button onclick="this.closest('.chatbot-widget').remove();" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
            </div>
            <div style="flex: 1; padding: 1rem; overflow-y: auto;">
                <div style="background: #f8fafc; padding: 0.8rem; border-radius: 10px; margin-bottom: 1rem;">
                    <p style="margin: 0; color: #1e293b;">¡Hola! 👋 ¿En qué puedo ayudarte con tu licencia inmobiliaria?</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button onclick="funnel.chatbotResponse('requisitos');" style="background: #e2e8f0; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: left;">
                        📋 ¿Cuáles son los requisitos?
                    </button>
                    <button onclick="funnel.chatbotResponse('proceso');" style="background: #e2e8f0; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: left;">
                        ⏱️ ¿Cuánto tiempo toma el proceso?
                    </button>
                    <button onclick="funnel.chatbotResponse('precio');" style="background: #e2e8f0; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: left;">
                        💰 ¿Cuál es el precio del curso?
                    </button>
                    <button onclick="funnel.chatbotResponse('contacto');" style="background: #e2e8f0; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; text-align: left;">
                        📞 ¿Cómo puedo contactar soporte?
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatbot);
    }

    chatbotResponse(topic) {
        const responses = {
            requisitos: 'Los requisitos básicos son: ser mayor de edad, tener comprobante de estudios de bachillerato, y no tener antecedentes penales. ¿Te gustaría más detalles sobre algún estado específico?',
            proceso: 'El proceso completo toma entre 60-90 días. Incluye: preparación del examen, presentación de documentos, y obtención de la licencia. ¡Nuestro curso te guía paso a paso!',
            precio: 'El curso tiene un precio especial de lanzamiento de $6,499 MXN (50% de descuento). Incluye 5 módulos, bonos por $10,500, y garantía de 30 días.',
            contacto: 'Puedes contactarnos por: Email: soporte@inmobiliariamx.com, Teléfono: +52 55 1234 5678, o WhatsApp: +52 55 1234 5678'
        };

        const response = responses[topic] || 'Gracias por tu consulta. Un asesor se pondrá en contacto contigo pronto.';
        
        // Add response to chatbot
        const chatbot = document.querySelector('.chatbot-widget');
        if (chatbot) {
            const chatArea = chatbot.querySelector('div[style*="flex: 1"]');
            const responseDiv = document.createElement('div');
            responseDiv.style.cssText = 'background: #dbeafe; padding: 0.8rem; border-radius: 10px; margin-bottom: 1rem; margin-top: 1rem;';
            responseDiv.innerHTML = `<p style="margin: 0; color: #1e293b;">${response}</p>`;
            chatArea.appendChild(responseDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    // Countdown Timer Functionality
    startCountdownTimer() {
        // Set end time (24 hours from now)
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update the countdown display
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');

            // If the countdown is finished, reset it
            if (distance < 0) {
                clearInterval(timer);
                // Reset to 23:59:59
                if (hoursElement) hoursElement.textContent = '23';
                if (minutesElement) minutesElement.textContent = '59';
                if (secondsElement) secondsElement.textContent = '59';
                
                // Restart the timer
                setTimeout(() => {
                    this.startCountdownTimer();
                }, 1000);
            }
        }, 1000);
    }
}

// Initialize the marketing funnel when the page loads
let funnel;
document.addEventListener('DOMContentLoaded', function() {
    funnel = new MarketingFunnel();
    
    // Add chatbot button to header
    const header = document.querySelector('.header .container');
    if (header) {
        const chatbotButton = document.createElement('button');
        chatbotButton.innerHTML = '💬 Chat';
        chatbotButton.style.cssText = `
            background: #2563eb;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        `;
        chatbotButton.onclick = () => funnel.showChatbot();
        header.appendChild(chatbotButton);
    }

    // Add quiz button to landing page CTA section
    const ctaSection = document.querySelector('.cta-section .container');
    if (ctaSection) {
        const quizButton = document.createElement('button');
        quizButton.innerHTML = '🧠 Descubre tu Perfil';
        quizButton.className = 'secondary-button';
        quizButton.style.marginLeft = '1rem';
        quizButton.onclick = () => funnel.showQuiz();
        ctaSection.appendChild(quizButton);
    }
});

// Global functions for onclick handlers
function showLanding() {
    funnel.showLanding();
}

function showWebinar() {
    funnel.showWebinar();
}

function showSales() {
    funnel.showSales();
}

function showCheckout() {
    funnel.showCheckout();
}

function showThankYou() {
    funnel.showThankYou();
}

function showCourseAccess() {
    funnel.showCourseAccess();
}

function showUpsells() {
    funnel.showUpsells();
}

function startModule(moduleNumber) {
    funnel.startModule(moduleNumber);
}
