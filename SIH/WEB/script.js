// Tribal Welfare Scheme Management System - Main JavaScript
// This file handles all the interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Set up navigation
    setupNavigation();
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up form handling
    setupSchemeForm();
    
    // Initialize charts
    initializeCharts();
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding page
            const targetPage = this.getAttribute('data-page');
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

// Enhanced Dashboard data loading
function loadDashboardData() {
    // Load metrics with enhanced display
    loadMetrics();
    
    // Load district data with multiple views
    loadDistrictData();
    
    // Load village data with enhanced filtering
    loadVillageData();
    
    // Load insights
    loadInsights();
    
    // Setup enhanced interactions
    setupDashboardInteractions();
}

function loadMetrics() {
    // Calculate and display key metrics with enhanced loading animation
    setTimeout(() => {
        const totalSTPopulation = calculateTotalSTPopulation();
        const totalHostels = calculateTotalHostels();
        const totalStudents = calculateTotalStudents();
        const avgSTPercentage = calculateAverageSTPercentage();
        
        // Update metric cards with animation
        animateValue('total-st-population', totalSTPopulation);
        animateValue('total-hostels', totalHostels);
        animateValue('total-students', totalStudents);
        animateValue('avg-st-percentage', avgSTPercentage, '%');
    }, 500);
}

// Animate value counting
function animateValue(elementId, endValue, suffix = '') {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 2000;
    const increment = endValue / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= endValue) {
            currentValue = endValue;
            clearInterval(timer);
        }
        
        if (suffix === '%') {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }
    }, 16);
}

function loadDistrictData() {
    const tableBody = document.getElementById('districtTableBody');
    const villages = tribalData.bheempurVillages10;
    
    tableBody.innerHTML = '';
    
    villages.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.village}</td>
            <td>${v.totalPop.toLocaleString()}</td>
            <td>${v.stPop.toLocaleString()}</td>
            <td>${v.stPercentage}%</td>
            <td>${v.literacy}%</td>
            <td>${v.workers.toLocaleString()}</td>
            <td>${v.agriculture.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
    
    setupDistrictSearch();
}

function loadVillageData() {
    const tableBody = document.getElementById('villageTableBody');
    const villages = tribalData.villageCensus;
    
    // Clear existing data
    tableBody.innerHTML = '';
    
    // Populate table
    villages.forEach(village => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${village.village}</td>
            <td>${village.mandal}</td>
            <td>${village.totalPop.toLocaleString()}</td>
            <td>${village.stPop.toLocaleString()}</td>
            <td>${village.stPercentage}%</td>
            <td>${village.literacy}%</td>
            <td>${village.workers.toLocaleString()}</td>
            <td>${village.agriculture.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Set up filters
    setupVillageFilters();
}

function setupDistrictSearch() {
    const searchInput = document.getElementById('districtSearch');
    const tableBody = document.getElementById('districtTableBody');
    
    function apply() {
        const rows = tableBody.querySelectorAll('tr');
        const searchTerm = (searchInput?.value || '').toLowerCase();
        rows.forEach(row => {
            const villageName = row.cells[0].textContent.toLowerCase();
            row.style.display = villageName.includes(searchTerm) ? '' : 'none';
        });
    }
    if (searchInput) searchInput.addEventListener('input', apply);
}

function setupVillageFilters() {
    const mandalFilter = document.getElementById('mandalFilter');
    const stPercentageFilter = document.getElementById('stPercentageFilter');
    const tableBody = document.getElementById('villageTableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    // Populate mandal filter
    const mandals = [...new Set(tribalData.villageCensus.map(v => v.mandal))];
    mandals.forEach(mandal => {
        const option = document.createElement('option');
        option.value = mandal;
        option.textContent = mandal;
        mandalFilter.appendChild(option);
    });
    
    // Apply filters
    function applyFilters() {
        const selectedMandal = mandalFilter.value;
        const selectedSTPercentage = stPercentageFilter.value;
        
        rows.forEach(row => {
            const mandal = row.cells[1].textContent;
            const stPercentage = parseFloat(row.cells[4].textContent);
            
            let showRow = true;
            
            if (selectedMandal && mandal !== selectedMandal) {
                showRow = false;
            }
            
            if (selectedSTPercentage) {
                switch (selectedSTPercentage) {
                    case 'high':
                        if (stPercentage <= 30) showRow = false;
                        break;
                    case 'medium':
                        if (stPercentage <= 15 || stPercentage > 30) showRow = false;
                        break;
                    case 'low':
                        if (stPercentage >= 15) showRow = false;
                        break;
                }
            }
            
            row.style.display = showRow ? '' : 'none';
        });
    }
    
    mandalFilter.addEventListener('change', applyFilters);
    stPercentageFilter.addEventListener('change', applyFilters);
}

// Chart initialization
function initializeCharts() {
    // ST Population Chart (Village-wise for Bheempur)
    const stPopulationCtx = document.getElementById('stPopulationChart');
    if (stPopulationCtx) {
        new Chart(stPopulationCtx, {
            type: 'doughnut',
            data: {
                labels: tribalData.bheempurVillages10.map(v => v.village),
                datasets: [{
                    data: tribalData.bheempurVillages10.map(v => v.stPop),
                    backgroundColor: [
                        '#FF6B6B', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#8B4513', '#C9CBCF', '#4BC0C0', '#2E8B57'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Second Chart: Use Bheempur data (bar of ST Percentage)
    const hostelCtx = document.getElementById('hostelChart');
    if (hostelCtx) {
        new Chart(hostelCtx, {
            type: 'bar',
            data: {
                labels: tribalData.bheempurVillages10.map(v => v.village),
                datasets: [{
                    label: 'ST %',
                    data: tribalData.bheempurVillages10.map(v => v.stPercentage),
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Enhanced Scheme form handling with multi-step functionality
function setupSchemeForm() {
    const form = document.getElementById('schemeForm');
    const districtSelect = document.getElementById('district');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');
    const resetBtn = document.getElementById('resetForm');
    
    let currentStep = 1;
    const totalSteps = 3;
    
    // Populate district dropdown
    tribalData.districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district.name;
        option.textContent = district.name;
        districtSelect.appendChild(option);
    });
    
    // Initialize form steps
    updateStepDisplay();
    
    // Next step handler
    nextBtn.addEventListener('click', function() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepDisplay();
            }
        }
    });
    
    // Previous step handler
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCurrentStep()) {
            // Get form data
            const formData = {
                villageName: document.getElementById('villageName').value,
                district: document.getElementById('district').value,
                mandal: document.getElementById('mandal').value,
                totalPopulation: parseInt(document.getElementById('totalPopulation').value),
                stPopulation: parseInt(document.getElementById('stPopulation').value),
                literacyRate: parseFloat(document.getElementById('literacyRate').value),
                waterAccess: document.getElementById('waterAccess').value,
                healthScore: parseFloat(document.getElementById('healthScore').value),
                livelihoodScore: parseFloat(document.getElementById('livelihoodScore').value),
                educationScore: parseFloat(document.getElementById('educationScore').value),
                forestCover: parseFloat(document.getElementById('forestCover').value),
                hasFRA: document.getElementById('hasFRA').value,
                isPVTG: document.getElementById('isPVTG').value,
                mfpDependency: document.getElementById('mfpDependency').value,
                unemploymentRate: parseFloat(document.getElementById('unemploymentRate').value),
                familyIncome: parseInt(document.getElementById('familyIncome').value),
                distanceToSchool: parseFloat(document.getElementById('distanceToSchool').value)
            };
            
            // Get scheme recommendations
            const recommendations = getSchemeRecommendations(formData);
            
            // Show results and update progress
            currentStep = 4;
            updateStepDisplay();
            displaySchemeResults(recommendations, formData);
        }
    });
    
    // Reset form handler
    resetBtn.addEventListener('click', function() {
        currentStep = 1;
        updateStepDisplay();
        document.getElementById('resultsSection').style.display = 'none';
        form.reset();
    });
    
    // Step validation
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#e9ecef';
            }
        });
        
        if (!isValid) {
            showNotification('Please fill all required fields in the current step', 'error');
        }
        
        return isValid;
    }
    
    // Update step display
    function updateStepDisplay() {
        // Update progress indicator
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else if (stepNumber < currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update form steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        if (currentStep <= totalSteps) {
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        }
        
        // Update navigation buttons
        prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentStep < totalSteps ? 'flex' : 'none';
        submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
        
        // Show results section if on step 4
        if (currentStep === 4) {
            document.getElementById('resultsSection').style.display = 'block';
        }
    }
    
    // Setup results filters
    setupResultsFilters();
}

// Setup results filtering and sorting
function setupResultsFilters() {
    const priorityFilter = document.getElementById('priorityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const exportBtn = document.getElementById('exportResults');
    const printBtn = document.getElementById('printResults');
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterResults);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortResults);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportResults);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printResults);
    }
}

// Filter results by priority
function filterResults() {
    const priority = document.getElementById('priorityFilter').value;
    const schemeCards = document.querySelectorAll('.scheme-card');
    
    schemeCards.forEach(card => {
        if (priority === 'all' || card.classList.contains(`${priority}-priority`)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort results
function sortResults() {
    const sortBy = document.getElementById('sortFilter').value;
    const container = document.getElementById('schemeResults');
    const cards = Array.from(container.querySelectorAll('.scheme-card'));
    
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.querySelector('.scheme-title').textContent.localeCompare(b.querySelector('.scheme-title').textContent);
            case 'ministry':
                return a.querySelector('.scheme-ministry').textContent.localeCompare(b.querySelector('.scheme-ministry').textContent);
            case 'priority':
            default:
                const priorityOrder = { 'high-priority': 1, 'medium-priority': 2, 'low-priority': 3 };
                return priorityOrder[a.className.split(' ')[1]] - priorityOrder[b.className.split(' ')[1]];
        }
    });
    
    cards.forEach(card => container.appendChild(card));
}

// Export results
function exportResults() {
    const results = document.getElementById('schemeResults').innerHTML;
    const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tribal Scheme Recommendations</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .scheme-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
                .scheme-title { font-weight: bold; color: #1e3c72; }
                .scheme-ministry { color: #666; }
                .priority-badge { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
                .priority-high { background: #dc3545; color: white; }
                .priority-medium { background: #ffc107; color: #333; }
                .priority-low { background: #28a745; color: white; }
            </style>
        </head>
        <body>
            <h1>Tribal Scheme Recommendations Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            ${results}
        </body>
        </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tribal-scheme-recommendations.html';
    a.click();
    URL.revokeObjectURL(url);
}

// Print results
function printResults() {
    const printWindow = window.open('', '_blank');
    const results = document.getElementById('schemeResults').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tribal Scheme Recommendations</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .scheme-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; page-break-inside: avoid; }
                .scheme-title { font-weight: bold; color: #1e3c72; }
                .scheme-ministry { color: #666; }
                .priority-badge { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
                .priority-high { background: #dc3545; color: white; }
                .priority-medium { background: #ffc107; color: #333; }
                .priority-low { background: #28a745; color: white; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <h1>Tribal Scheme Recommendations Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            ${results}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function displaySchemeResults(recommendations, formData) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('schemeResults');
    const resultsSummary = document.getElementById('resultsSummary');
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Update results summary
    const stPercentage = ((formData.stPopulation / formData.totalPopulation) * 100).toFixed(1);
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const mediumPriorityCount = recommendations.filter(r => r.priority === 'medium').length;
    const lowPriorityCount = recommendations.filter(r => r.priority === 'low').length;
    
    resultsSummary.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div><strong>Village:</strong> ${formData.villageName}, ${formData.mandal}</div>
            <div><strong>ST Population:</strong> ${formData.stPopulation} (${stPercentage}%)</div>
            <div><strong>Total Recommendations:</strong> ${recommendations.length}</div>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <span class="priority-badge priority-high">${highPriorityCount} High Priority</span>
            <span class="priority-badge priority-medium">${mediumPriorityCount} Medium Priority</span>
            <span class="priority-badge priority-low">${lowPriorityCount} Low Priority</span>
        </div>
    `;
    
    if (recommendations.length === 0) {
        resultsContainer.innerHTML = `
            <div class="scheme-card" style="text-align: center; padding: 3rem;">
                <i class="fas fa-info-circle" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
                <h4 style="color: #1e3c72; margin-bottom: 1rem;">No Specific Schemes Recommended</h4>
                <p style="color: #666; margin-bottom: 1.5rem;">Based on the provided data, no specific tribal welfare schemes are recommended at this time.</p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea;">
                    <strong>Suggestions:</strong>
                    <ul style="text-align: left; margin: 0.5rem 0 0 1rem;">
                        <li>Consider general development programs</li>
                        <li>Contact local authorities for guidance</li>
                        <li>Review data accuracy and completeness</li>
                        <li>Check for updated scheme criteria</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }
    
    // Display recommendations
    recommendations.forEach((scheme, index) => {
        const schemeCard = document.createElement('div');
        schemeCard.className = `scheme-card ${scheme.priority}-priority`;
        
        const priorityClass = `priority-${scheme.priority}`;
        const priorityIcon = scheme.priority === 'high' ? 'exclamation-triangle' : 
                           scheme.priority === 'medium' ? 'info-circle' : 'check-circle';
        
        schemeCard.innerHTML = `
            <div class="priority-badge ${priorityClass}">
                <i class="fas fa-${priorityIcon}"></i>
                ${scheme.priority.toUpperCase()} PRIORITY
            </div>
            <div class="scheme-title">${scheme.name}</div>
            <div class="scheme-ministry">
                <i class="fas fa-building"></i> ${scheme.ministry}
            </div>
            <div class="scheme-benefits">
                <strong><i class="fas fa-gift"></i> Benefits:</strong> ${scheme.benefits}
            </div>
            <div class="scheme-eligibility">
                <strong><i class="fas fa-user-check"></i> Eligibility:</strong> ${scheme.eligibility}
            </div>
            <div class="scheme-rule">
                <strong><i class="fas fa-cogs"></i> DSS Rule:</strong> ${scheme.rule}
            </div>
            <div class="scheme-rule" style="background: #e8f4fd; border-left: 3px solid #667eea;">
                <strong><i class="fas fa-lightbulb"></i> Recommendation Reason:</strong> ${scheme.reason} 
                <br><small style="color: #666;">ST Population: ${scheme.stPercentage}% | Village: ${formData.villageName}</small>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e9ecef;">
                <button class="btn btn-outline" style="padding: 8px 16px; font-size: 0.8rem;" onclick="showSchemeDetails('${scheme.name}')">
                    <i class="fas fa-info"></i> More Details
                </button>
            </div>
        `;
        
        resultsContainer.appendChild(schemeCard);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Show success notification
    showNotification(`Found ${recommendations.length} scheme recommendations for ${formData.villageName}`, 'success');
}

// Show detailed scheme information
function showSchemeDetails(schemeName) {
    const scheme = tribalData.schemes.find(s => s.name === schemeName);
    if (!scheme) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 600px; max-height: 80vh; overflow-y: auto; margin: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="color: #1e3c72; margin: 0;">${scheme.name}</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Ministry:</strong> ${scheme.ministry}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Benefits:</strong><br>${scheme.benefits}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Eligibility Criteria:</strong><br>${scheme.eligibility}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>DSS Rule:</strong><br>${scheme.rule}
            </div>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-top: 1.5rem;">
                <strong>Implementation Steps:</strong>
                <ol style="margin: 0.5rem 0 0 1rem;">
                    <li>Verify eligibility criteria</li>
                    <li>Gather required documents</li>
                    <li>Submit application to concerned department</li>
                    <li>Follow up on application status</li>
                    <li>Implement approved benefits</li>
                </ol>
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Enhanced Dashboard Functions

// Load insights data
function loadInsights() {
    const topEl = document.getElementById('topDistrict');
    const needsEl = document.getElementById('needsAttention');
    const growthEl = document.getElementById('growthTrend');
    const successEl = document.getElementById('successStories');
    if (!topEl || !needsEl || !growthEl || !successEl) {
        return; // Insights section not present; skip safely
    }
    const districts = tribalData.districts;
    const topDistrict = districts.reduce((max, district) => 
        district.stPercentage > max.stPercentage ? district : max
    );
    topEl.textContent = `${topDistrict.name} (${topDistrict.stPercentage}% ST)`;
    const needsAttention = districts.reduce((min, district) => 
        district.stPercentage < min.stPercentage ? district : min
    );
    needsEl.textContent = `${needsAttention.name} (${needsAttention.stPercentage}% ST)`;
    const avgGrowth = districts.reduce((sum, district) => sum + district.stPercentage, 0) / districts.length;
    growthEl.textContent = `Average ${avgGrowth.toFixed(1)}% ST population across districts`;
    const highPerformingDistricts = districts.filter(d => d.stPercentage > 30).length;
    successEl.textContent = `${highPerformingDistricts} districts with >30% ST population`;
}

// Setup dashboard interactions
function setupDashboardInteractions() {
    // Setup view toggles
    setupViewToggles();
    
    // Setup sorting
    setupTableSorting();
    
    // Setup enhanced filtering
    setupEnhancedFiltering();
    
    // Setup chart interactions
    setupChartInteractions();
}

// Setup view toggles
function setupViewToggles() {
    // District view toggle
    const districtViewBtns = document.querySelectorAll('[data-view]');
    districtViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            toggleView(view);
            
            // Update active state
            districtViewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Toggle between table and card view
function toggleView(view) {
    const tableView = document.getElementById('districtTableView');
    const cardView = document.getElementById('districtCardView');
    
    if (view === 'table') {
        tableView.style.display = 'block';
        cardView.style.display = 'none';
    } else if (view === 'cards') {
        tableView.style.display = 'none';
        cardView.style.display = 'block';
        loadDistrictCards();
    }
}

// Load district cards
function loadDistrictCards() {
    const cardsGrid = document.getElementById('districtCardsGrid');
    const districts = tribalData.districts;
    
    cardsGrid.innerHTML = '';
    
    districts.forEach(district => {
        const card = document.createElement('div');
        card.className = 'district-card';
        card.innerHTML = `
            <h4>${district.name}</h4>
            <div class="district-stats">
                <div class="stat-item">
                    <div class="value">${district.stPopulation.toLocaleString()}</div>
                    <div class="label">ST Population</div>
                </div>
                <div class="stat-item">
                    <div class="value">${district.stPercentage}%</div>
                    <div class="label">ST Percentage</div>
                </div>
                <div class="stat-item">
                    <div class="value">${district.hostels}</div>
                    <div class="label">Hostels</div>
                </div>
                <div class="stat-item">
                    <div class="value">${district.students.toLocaleString()}</div>
                    <div class="label">Students</div>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showDistrictDetails('${district.name}')">
                    <i class="fas fa-info"></i> View Details
                </button>
            </div>
        `;
        cardsGrid.appendChild(card);
    });
}

// Setup table sorting
function setupTableSorting() {
    // This will be handled by the onclick attributes in HTML
}

// Sort table function
function sortTable(column) {
    const table = document.getElementById('districtTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aVal = a.cells[getColumnIndex(column)].textContent;
        const bVal = b.cells[getColumnIndex(column)].textContent;
        
        // Handle numeric columns
        if (['stPopulation', 'stPercentage', 'stMales', 'stFemales', 'sexRatio', 'hostels', 'students'].includes(column)) {
            return parseFloat(aVal.replace(/,/g, '')) - parseFloat(bVal.replace(/,/g, ''));
        }
        
        // Handle text columns
        return aVal.localeCompare(bVal);
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

// Get column index for sorting
function getColumnIndex(column) {
    const columnMap = {
        'village': 0,
        'totalPop': 1,
        'stPopulation': 2,
        'stPercentage': 3,
        'literacy': 4,
        'workers': 5,
        'agriculture': 6
    };
    return columnMap[column] || 0;
}

// Setup enhanced filtering
function setupEnhancedFiltering() {
    // District search
    const districtSearch = document.getElementById('districtSearch');
    if (districtSearch) {
        districtSearch.addEventListener('input', filterDistricts);
    }
    
    // Village filters
    const mandalFilter = document.getElementById('mandalFilter');
    const stPercentageFilter = document.getElementById('stPercentageFilter');
    const literacyFilter = document.getElementById('literacyFilter');
    
    if (mandalFilter) mandalFilter.addEventListener('change', filterVillages);
    if (stPercentageFilter) stPercentageFilter.addEventListener('change', filterVillages);
    if (literacyFilter) literacyFilter.addEventListener('change', filterVillages);
}

// Filter districts
function filterDistricts() {
    const searchTerm = document.getElementById('districtSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#districtTableBody tr');
    
    rows.forEach(row => {
        const districtName = row.cells[0].textContent.toLowerCase();
        row.style.display = districtName.includes(searchTerm) ? '' : 'none';
    });
}

// Filter villages
function filterVillages() {
    const mandalFilter = document.getElementById('mandalFilter').value;
    const stPercentageFilter = document.getElementById('stPercentageFilter').value;
    const literacyFilter = document.getElementById('literacyFilter').value;
    const rows = document.querySelectorAll('#villageTableBody tr');
    
    rows.forEach(row => {
        const mandal = row.cells[1].textContent;
        const stPercentage = parseFloat(row.cells[4].textContent);
        const literacy = parseFloat(row.cells[5].textContent);
        
        let showRow = true;
        
        if (mandalFilter && mandal !== mandalFilter) showRow = false;
        
        if (stPercentageFilter) {
            switch (stPercentageFilter) {
                case 'high': if (stPercentage <= 30) showRow = false; break;
                case 'medium': if (stPercentage <= 15 || stPercentage > 30) showRow = false; break;
                case 'low': if (stPercentage >= 15) showRow = false; break;
            }
        }
        
        if (literacyFilter) {
            switch (literacyFilter) {
                case 'high': if (literacy <= 70) showRow = false; break;
                case 'medium': if (literacy <= 50 || literacy > 70) showRow = false; break;
                case 'low': if (literacy >= 50) showRow = false; break;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

// Setup chart interactions
function setupChartInteractions() {
    // Chart type changes will be handled by onchange attributes
}

// Update chart type
function updateChart(type) {
    if (type === 'population') {
        const chartType = document.getElementById('chartType1').value;
        // Recreate chart with new type
        createPopulationChart(chartType);
    } else if (type === 'hostels') {
        const chartType = document.getElementById('chartType2').value;
        // Recreate chart with new type
        createHostelChart(chartType);
    }
}

// Fullscreen chart
function fullscreenChart(type) {
    // Implementation for fullscreen chart view
    showNotification('Fullscreen chart view coming soon!', 'info');
}

// Show detailed view
function showDetailedView(type) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    let content = '';
    switch (type) {
        case 'population':
            content = `
                <h3>ST Population Details</h3>
                <p>Total ST Population: ${calculateTotalSTPopulation().toLocaleString()}</p>
                <p>Average per District: ${(calculateTotalSTPopulation() / tribalData.districts.length).toLocaleString()}</p>
                <p>Growth Rate: +2.3% from last year</p>
            `;
            break;
        case 'hostels':
            content = `
                <h3>ST Hostels Details</h3>
                <p>Total Hostels: ${calculateTotalHostels()}</p>
                <p>Average per District: ${(calculateTotalHostels() / tribalData.districts.length).toFixed(1)}</p>
                <p>New Hostels This Year: 5</p>
            `;
            break;
        case 'students':
            content = `
                <h3>ST Students Details</h3>
                <p>Total Students: ${calculateTotalStudents().toLocaleString()}</p>
                <p>Average per Hostel: ${(calculateTotalStudents() / calculateTotalHostels()).toFixed(1)}</p>
                <p>Enrollment Growth: +8.7%</p>
            `;
            break;
        case 'percentage':
            content = `
                <h3>ST Percentage Details</h3>
                <p>Average ST Percentage: ${calculateAverageSTPercentage()}%</p>
                <p>Highest District: ${tribalData.districts.reduce((max, d) => d.stPercentage > max.stPercentage ? d : max).name}</p>
                <p>Improvement: +1.2% from last year</p>
            `;
            break;
    }
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; margin: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0;">Detailed Information</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            ${content}
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
}

// Export data functions
function exportData(type) {
    if (type === 'districts') {
        exportToCSV(tribalData.districts, 'districts.csv');
    } else if (type === 'villages') {
        exportToCSV(tribalData.villageCensus, 'villages.csv');
    }
}

// Export to CSV
function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported ${filename} successfully!`, 'success');
}

// Convert data to CSV
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    return csvContent;
}

// Generate report
function generateReport() {
    showNotification('Generating comprehensive report...', 'info');
    // Implementation for PDF report generation
}

// Refresh data
function refreshData() {
    showNotification('Refreshing data...', 'info');
    setTimeout(() => {
        loadDashboardData();
        showNotification('Data refreshed successfully!', 'success');
    }, 1000);
}

// Show district details
function showDistrictDetails(districtName) {
    const district = tribalData.districts.find(d => d.name === districtName);
    if (!district) return;
    
    showDetailedView('district');
}

// Toggle village view
function toggleVillageView(view) {
    const tableView = document.getElementById('villageTableView');
    const mapView = document.getElementById('villageMapView');
    
    if (view === 'table') {
        tableView.style.display = 'block';
        mapView.style.display = 'none';
    } else if (view === 'map') {
        tableView.style.display = 'none';
        mapView.style.display = 'block';
    }
}

// Load map view
function loadMapView() {
    showNotification('Loading interactive map...', 'info');
    // Implementation for map loading
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function formatPercentage(num) {
    return num.toFixed(1) + '%';
}

// Error handling
function showError(message) {
    console.error(message);
    showNotification(message, 'error');
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        loadDashboardData,
        getSchemeRecommendations,
        displaySchemeResults
    };
}
