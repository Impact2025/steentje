// Booking form functionality
class BookingForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.selectedSessionType = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.formData = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateCalendar();
        this.updateProgress();
    }
    
    bindEvents() {
        // Session type selection
        document.querySelectorAll('.session-type').forEach(card => {
            card.addEventListener('click', (e) => this.selectSessionType(e));
        });
        
        // Step navigation
        document.getElementById('next-step-1').addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-2').addEventListener('click', () => this.nextStep());
        document.getElementById('next-step-3').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-step-2').addEventListener('click', () => this.prevStep());
        document.getElementById('prev-step-3').addEventListener('click', () => this.prevStep());
        document.getElementById('prev-step-4').addEventListener('click', () => this.prevStep());
        
        // Form submission
        document.getElementById('submit-booking').addEventListener('click', (e) => this.submitForm(e));
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    selectSessionType(e) {
        // Remove previous selection
        document.querySelectorAll('.session-type').forEach(card => {
            card.classList.remove('border-warm-terracotta', 'bg-warm-terracotta/10');
            card.classList.add('border-warm-terracotta/20');
        });
        
        // Add selection to clicked card
        const card = e.currentTarget;
        card.classList.remove('border-warm-terracotta/20');
        card.classList.add('border-warm-terracotta', 'bg-warm-terracotta/10');
        
        // Store selection
        this.selectedSessionType = {
            type: card.dataset.type,
            price: parseInt(card.dataset.price)
        };
        
        // Enable next button
        document.getElementById('next-step-1').disabled = false;
        document.getElementById('next-step-1').classList.remove('opacity-50');
    }
    
    generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day p-2 rounded cursor-pointer border border-transparent';
            dayElement.textContent = day;
            
            const dayDate = new Date(currentYear, currentMonth, day);
            const isToday = dayDate.toDateString() === today.toDateString();
            const isPast = dayDate < today;
            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            
            // Disable past dates and weekends
            if (isPast || isWeekend) {
                dayElement.classList.add('disabled', 'text-warm-gray/30');
            } else {
                dayElement.addEventListener('click', () => this.selectDate(dayDate));
            }
            
            // Highlight today
            if (isToday && !isPast) {
                dayElement.classList.add('border-warm-terracotta');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    selectDate(date) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked day
        event.target.classList.add('selected');
        
        // Store selection
        this.selectedDate = date;
        
        // Generate time slots
        this.generateTimeSlots(date);
        
        // Reset time selection
        this.selectedTime = null;
        document.getElementById('next-step-2').disabled = true;
    }
    
    generateTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = '';
        
        const timeSlots = [
            '09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'
        ];
        
        timeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot p-3 border border-warm-terracotta/20 rounded cursor-pointer text-center';
            timeSlot.textContent = time;
            
            // Randomly disable some slots for demo purposes
            if (Math.random() > 0.7) {
                timeSlot.classList.add('disabled', 'opacity-30', 'cursor-not-allowed');
            } else {
                timeSlot.addEventListener('click', () => this.selectTime(time, timeSlot));
            }
            
            timeSlotsContainer.appendChild(timeSlot);
        });
    }
    
    selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked slot
        element.classList.add('selected');
        
        // Store selection
        this.selectedTime = time;
        
        // Enable next button
        document.getElementById('next-step-2').disabled = false;
        document.getElementById('next-step-2').classList.remove('opacity-50');
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Hide current step
            document.getElementById(`step-${this.currentStep}`).classList.remove('active');
            
            // Show next step
            this.currentStep++;
            document.getElementById(`step-${this.currentStep}`).classList.add('active');
            
            // Update progress
            this.updateProgress();
            
            // Update summary if on step 4
            if (this.currentStep === 4) {
                this.updateBookingSummary();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            // Hide current step
            document.getElementById(`step-${this.currentStep}`).classList.remove('active');
            
            // Show previous step
            this.currentStep--;
            document.getElementById(`step-${this.currentStep}`).classList.add('active');
            
            // Update progress
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressBar = document.querySelector('.progress-bar');
        const currentStepSpan = document.getElementById('current-step');
        const progressText = document.getElementById('progress-text');
        
        progressBar.style.width = `${progress}%`;
        currentStepSpan.textContent = this.currentStep;
        
        const stepTexts = [
            'Kies type sessie',
            'Selecteer datum en tijd',
            'Vul jullie gegevens in',
            'Bevestig afspraak'
        ];
        
        progressText.textContent = stepTexts[this.currentStep - 1];
    }
    
    updateBookingSummary() {
        const summaryContainer = document.getElementById('booking-summary');
        
        const sessionTypeNames = {
            'intake': 'Kennismaking (gratis)',
            'single': 'Enkele sessie',
            'package': 'Traject pakket (6 sessies)'
        };
        
        const formattedDate = this.selectedDate.toLocaleDateString('nl-NL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        summaryContainer.innerHTML = `
            <div class="flex justify-between">
                <span>Type sessie:</span>
                <span class="font-semibold">${sessionTypeNames[this.selectedSessionType.type]}</span>
            </div>
            <div class="flex justify-between">
                <span>Datum:</span>
                <span class="font-semibold">${formattedDate}</span>
            </div>
            <div class="flex justify-between">
                <span>Tijd:</span>
                <span class="font-semibold">${this.selectedTime}</span>
            </div>
            ${this.selectedSessionType.price > 0 ? `
            <div class="flex justify-between border-t border-warm-gray/20 pt-2 mt-2">
                <span class="font-semibold">Totaal:</span>
                <span class="font-semibold text-warm-terracotta">€${this.selectedSessionType.price}</span>
            </div>
            ` : ''}
        `;
    }
    
    submitForm(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = document.getElementById('submit-booking');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Bezig met verwerken...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showSuccessMessage() {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-cream-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
                <div class="w-16 h-16 bg-deep-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="font-playfair text-2xl font-bold text-warm-gray mb-4">Afspraak bevestigd!</h3>
                <p class="text-warm-gray/70 mb-6">
                    Bedankt voor jullie aanvraag. We nemen binnen 24 uur contact op om de afspraak definitief te maken.
                </p>
                <button class="btn-primary px-6 py-3 rounded-full text-white font-inter font-semibold" onclick="this.closest('.fixed').remove()">
                    Sluiten
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }
}

// Initialize booking form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new BookingForm();
    
    // Simple reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});