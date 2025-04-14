document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomePage = document.getElementById('welcome-page');
    const setupPage = document.getElementById('setup-page');
    const mainPage = document.getElementById('main-page');
    const startBtn = document.getElementById('start-btn');
    const saveSetupBtn = document.getElementById('save-setup-btn');
    const userNameDisplay = document.getElementById('user-name-display');
    const cycleStatus = document.getElementById('cycle-status');
    const dailyQuote = document.getElementById('daily-quote');
    const predictionInfo = document.getElementById('prediction-info');
    const calendarTitle = document.getElementById('calendar-title');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const logPeriodBtn = document.getElementById('log-period-btn');
    const logPeriodModal = document.getElementById('log-period-modal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const savePeriodBtn = document.getElementById('save-period-btn');
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const editUserName = document.getElementById('edit-userName');
    const editPeriodLength = document.getElementById('edit-periodLength');
    const editCycleLength = document.getElementById('edit-cycleLength');
    const welcomeQuote = document.getElementById('welcome-quote');
    const quoteAuthor = document.getElementById('quote-author');
    
    // Variables
    let currentMonth, currentYear;
    let userData = null;
    
    // Positive Quotes
    const quotes = [
        { quote: "Your body is a garden. Tend to it with love and care.", author: "Mochi Blossom" },
        { quote: "Track your cycle, honor your rhythms, embrace your power.", author: "Mochi Blossom" },
        { quote: "Self-care isn't selfish, it's sacred.", author: "Mochi Blossom" },
        { quote: "Your cycle is your inner compass. Listen to it.", author: "Mochi Blossom" },
        { quote: "Wellness is a journey, not a destination.", author: "Mochi Blossom" },
        { quote: "Knowledge of your body is power over your health.", author: "Mochi Blossom" },
        { quote: "Honor each phase of your cycle as it comes and goes.", author: "Mochi Blossom" },
        { quote: "Your cycle is unique, just like you.", author: "Mochi Blossom" },
        { quote: "Each month is a new opportunity to connect with yourself.", author: "Mochi Blossom" },
        { quote: "Embrace the wisdom of your body's natural rhythms.", author: "Mochi Blossom" }
    ];
    
    // Daily encouragement quotes
    const dailyEncouragement = [
        "Remember to drink plenty of water today.",
        "Take a moment for deep breathing and relaxation.",
        "Your body is working perfectly, even when it doesn't feel like it.",
        "Be gentle with yourself today.",
        "Listen to what your body needs right now.",
        "Self-care isn't a luxury, it's a necessity.",
        "Your health journey matters. You're doing great!",
        "Small consistent actions lead to big wellness results.",
        "Today is a new opportunity to care for yourself.",
        "Progress isn't always linear, and that's okay.",
        "You deserve to prioritize your wellbeing."
    ];
    
    // Show welcome quote
    function setRandomWelcomeQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        welcomeQuote.textContent = `"${quotes[randomIndex].quote}"`;
        quoteAuthor.textContent = quotes[randomIndex].author;
    }
    
    // Set daily encouragement
    function setDailyEncouragement() {
        const today = new Date();
        const index = today.getDate() % dailyEncouragement.length;
        dailyQuote.textContent = dailyEncouragement[index];
    }
    
    // Initialize app
    function initApp() {
        setRandomWelcomeQuote();
        
        // Check if user data already exists
        if (localStorage.getItem('mochiBlossomData')) {
            userData = JSON.parse(localStorage.getItem('mochiBlossomData'));
            navigateToMainPage();
        }
    }
    
    // Event Listeners
    startBtn.addEventListener('click', function() {
        const userName = document.getElementById('userName').value;
        if (!userName) {
            alert('Please enter your name.');
            return;
        }
        
        showPage(setupPage);
    });
    
    saveSetupBtn.addEventListener('click', function() {
        const userName = document.getElementById('userName').value;
        const lastPeriodDate = document.getElementById('lastPeriodDate').value;
        const periodLength = parseInt(document.getElementById('periodLength').value);
        const cycleLength = parseInt(document.getElementById('cycleLength').value);
        
        if (!userName || !lastPeriodDate || isNaN(periodLength) || isNaN(cycleLength)) {
            alert('Please fill in all fields correctly.');
            return;
        }
        
        // Create user data object
        userData = {
            name: userName,
            periodLength: periodLength,
            cycleLength: cycleLength,
            periods: [{
                startDate: lastPeriodDate,
                endDate: addDays(new Date(lastPeriodDate), periodLength - 1).toISOString().split('T')[0]
            }]
        };
        
        // Save to local storage
        localStorage.setItem('mochiBlossomData', JSON.stringify(userData));
        
        navigateToMainPage();
    });
    
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    logPeriodBtn.addEventListener('click', function() {
        const today = new Date();
        document.getElementById('actual-period-date').value = today.toISOString().split('T')[0];
        logPeriodModal.style.display = 'block';
    });
    
    savePeriodBtn.addEventListener('click', function() {
        const actualDate = document.getElementById('actual-period-date').value;
        
        if (!actualDate) {
            alert('Please select a date.');
            return;
        }
        
        // Add new period
        userData.periods.push({
            startDate: actualDate,
            endDate: addDays(new Date(actualDate), userData.periodLength - 1).toISOString().split('T')[0]
        });
        
        // Sort periods by date
        userData.periods.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        
        // Save updated data
        localStorage.setItem('mochiBlossomData', JSON.stringify(userData));
        
        // Close modal and refresh
        logPeriodModal.style.display = 'none';
        updateCycleStatus();
        renderCalendar();
    });
    
    editProfileBtn.addEventListener('click', function() {
        editUserName.value = userData.name;
        editPeriodLength.value = userData.periodLength;
        editCycleLength.value = userData.cycleLength;
        editProfileModal.style.display = 'block';
    });
    
    updateProfileBtn.addEventListener('click', function() {
        const newName = editUserName.value;
        const newPeriodLength = parseInt(editPeriodLength.value);
        const newCycleLength = parseInt(editCycleLength.value);
        
        if (!newName || isNaN(newPeriodLength) || isNaN(newCycleLength)) {
            alert('Please fill in all fields correctly.');
            return;
        }
        
        // Update user data
        userData.name = newName;
        userData.periodLength = newPeriodLength;
        userData.cycleLength = newCycleLength;
        
        // Save to local storage
        localStorage.setItem('mochiBlossomData', JSON.stringify(userData));
        
        // Close modal and refresh
        editProfileModal.style.display = 'none';
        userNameDisplay.textContent = userData.name;
        updateCycleStatus();
        renderCalendar();
    });
    
    // Close modals when clicking on X or outside
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            logPeriodModal.style.display = 'none';
            editProfileModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === logPeriodModal) {
            logPeriodModal.style.display = 'none';
        }
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });
    
    // Functions
    function showPage(page) {
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.transform = 'translateX(100%)';
            p.style.opacity = '0';
        });
        
        // Apply transitions
        setTimeout(() => {
            page.classList.add('active');
            page.style.transform = 'translateX(0)';
            page.style.opacity = '1';
        }, 50);
    }
    
    function navigateToMainPage() {
        userNameDisplay.textContent = userData.name;
        currentMonth = new Date().getMonth();
        currentYear = new Date().getFullYear();
        
        setDailyEncouragement();
        updateCycleStatus();
        renderCalendar();
        showPage(mainPage);
    }
    
    function updateCycleStatus() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get the most recent period
        const lastPeriod = userData.periods[userData.periods.length - 1];
        const lastPeriodDate = new Date(lastPeriod.startDate);
        lastPeriodDate.setHours(0, 0, 0, 0);
        
        // Calculate days since last period started
        const daysSinceLastPeriod = Math.floor((today - lastPeriodDate) / (24 * 60 * 60 * 1000));
        
        // Calculate the next expected period
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + userData.cycleLength);
        
        // Calculate days until next period
        const daysUntilNextPeriod = Math.floor((nextPeriodDate - today) / (24 * 60 * 60 * 1000));
        
        // Check if currently on period
        if (daysSinceLastPeriod < userData.periodLength) {
            cycleStatus.innerHTML = `
                <div class="current-status">
                    <h3>You are on day ${daysSinceLastPeriod + 1} of your period</h3>
                    <p>Your period should end in ${userData.periodLength - daysSinceLastPeriod - 1} days.</p>
                </div>
            `;
        } else {
            cycleStatus.innerHTML = `
                <div class="current-status">
                    <h3>You are on day ${daysSinceLastPeriod + 1} of your cycle</h3>
                    <p>Your next period is expected in ${daysUntilNextPeriod} days.</p>
                </div>
            `;
        }
        
        // Predict next 3 periods
        let nextPredictionDate = new Date(nextPeriodDate);
        let predictionsHTML = '<h3>Upcoming Periods:</h3><ul>';
        
        for (let i = 0; i < 3; i++) {
            const formattedDate = nextPredictionDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            predictionsHTML += `<li>Period ${i + 1}: ${formattedDate}</li>`;
            
            nextPredictionDate.setDate(nextPredictionDate.getDate() + userData.cycleLength);
        }
        
        predictionsHTML += '</ul>';
        predictionInfo.innerHTML = predictionsHTML;
    }
    
    function renderCalendar() {
        // Clear previous calendar
        calendarDays.innerHTML = '';
        
        // Set calendar title
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Previous month empty cells
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(emptyCell);
        }
        
        // Current month days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Generate all future period dates based on the last logged period
        const lastPeriod = userData.periods[userData.periods.length - 1];
        const futurePeriods = [];
        let nextPeriodStart = new Date(lastPeriod.startDate);
        
        // Generate future periods for 1 year
        for (let i = 0; i < 13; i++) {
            nextPeriodStart = new Date(nextPeriodStart);
            nextPeriodStart.setDate(nextPeriodStart.getDate() + userData.cycleLength);
            
            const periodEnd = new Date(nextPeriodStart);
            periodEnd.setDate(periodEnd.getDate() + userData.periodLength - 1);
            
            futurePeriods.push({
                startDate: nextPeriodStart.toISOString().split('T')[0],
                endDate: periodEnd.toISOString().split('T')[0]
            });
        }
        
        // Combine actual and predicted periods
        const allPeriods = [...userData.periods, ...futurePeriods];
        
        // Render days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;
            
            const currentDate = new Date(currentYear, currentMonth, day);
            
            // Check if today
            if (currentDate.toDateString() === today.toDateString()) {
                dayCell.classList.add('today');
            }
            
            // Check if period day
            const isPeriodDay = allPeriods.some(period => {
                const start = new Date(period.startDate);
                const end = new Date(period.endDate);
                return currentDate >= start && currentDate <= end;
            });
            
            if (isPeriodDay) {
                dayCell.classList.add('period');
            }
            
            // Check if fertile window day (typically 5 days before ovulation)
            allPeriods.forEach(period => {
                const periodStart = new Date(period.startDate);
                const ovulationDate = new Date(periodStart);
                ovulationDate.setDate(ovulationDate.getDate() - 14);
                
               const fertileWindowStart = new Date(ovulationDate);
                fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);
                
                const fertileWindowEnd = new Date(ovulationDate);
                fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);
                
                if (currentDate >= fertileWindowStart && currentDate <= fertileWindowEnd) {
                    if (!isPeriodDay) { // Don't mark fertile if already marked as period
                        dayCell.classList.add('fertile');
                    }
                    
                    // Mark ovulation day
                    if (currentDate.toDateString() === ovulationDate.toDateString()) {
                        dayCell.classList.add('ovulation');
                    }
                }
            });
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    // Helper function to add days to a date
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    // Initialize the app
    initApp();
});      
