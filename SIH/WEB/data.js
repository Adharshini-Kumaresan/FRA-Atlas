// Tribal Welfare Scheme Management System - Data Management
// This file contains all the data processing and management functions

// Sample data based on the CSV files provided
const tribalData = {
    // District-wise ST population data
    districts: [
        { name: "ADILABAD", stPopulation: 224622, stPercentage: 31.68, stMales: 112953, stFemales: 111669, sexRatio: 989, hostels: 54, students: 19706 },
        { name: "BHADRADRI", stPopulation: 392034, stPercentage: 36.66, stMales: 194351, stFemales: 197683, sexRatio: 1017, hostels: 64, students: 19657 },
        { name: "HYDERABAD", stPopulation: 48937, stPercentage: 1.24, stMales: 25556, stFemales: 23381, sexRatio: 915, hostels: 7, students: 631 },
        { name: "JAGTIAL", stPopulation: 23351, stPercentage: 2.37, stMales: 11562, stFemales: 11789, sexRatio: 1020, hostels: 5, students: 310 },
        { name: "JANGAON", stPopulation: 62662, stPercentage: 11.06, stMales: 31791, stFemales: 30871, sexRatio: 971, hostels: 7, students: 1995 },
        { name: "JAYASHANKAR", stPopulation: 123544, stPercentage: 17.37, stMales: 61023, stFemales: 62521, sexRatio: 1025, hostels: 51, students: 7198 },
        { name: "JOGULAMBA", stPopulation: 9376, stPercentage: 1.54, stMales: 4728, stFemales: 4648, sexRatio: 983, hostels: 1, students: 150 },
        { name: "KAMAREDDY", stPopulation: 81656, stPercentage: 8.4, stMales: 40818, stFemales: 40838, sexRatio: 1000, hostels: 7, students: 1037 },
        { name: "KARIMNAGAR", stPopulation: 12779, stPercentage: 1.27, stMales: 6485, stFemales: 6294, sexRatio: 971, hostels: 4, students: 258 },
        { name: "KHAMMAM", stPopulation: 199342, stPercentage: 14.22, stMales: 99808, stFemales: 99534, sexRatio: 997, hostels: 18, students: 3791 },
        { name: "KOMARAM BHEEM", stPopulation: 133627, stPercentage: 25.91, stMales: 65866, stFemales: 67761, sexRatio: 1029, hostels: 46, students: 12327 },
        { name: "MAHABUBABAD", stPopulation: 292778, stPercentage: 37.8, stMales: 148139, stFemales: 144639, sexRatio: 976, hostels: 26, students: 7534 },
        { name: "MAHABUBNAGAR", stPopulation: 132131, stPercentage: 8.89, stMales: 67395, stFemales: 64736, sexRatio: 961, hostels: 6, students: 1454 },
        { name: "MANCHERIAL", stPopulation: 56969, stPercentage: 7.06, stMales: 28883, stFemales: 28086, sexRatio: 972, hostels: 17, students: 3404 },
        { name: "MEDAK", stPopulation: 72900, stPercentage: 9.5, stMales: 36854, stFemales: 36046, sexRatio: 978, hostels: 8, students: 1138 },
        { name: "MEDCHAL", stPopulation: 55244, stPercentage: 2.26, stMales: 28367, stFemales: 26877, sexRatio: 947, hostels: 1, students: 70 },
        { name: "NAGARKURNOOL", stPopulation: 106880, stPercentage: 12.4, stMales: 55300, stFemales: 51580, sexRatio: 933, hostels: 24, students: 6144 },
        { name: "NALGONDA", stPopulation: 209252, stPercentage: 12.93, stMales: 109272, stFemales: 99980, sexRatio: 915, hostels: 31, students: 10335 },
        { name: "NIRMAL", stPopulation: 80576, stPercentage: 11.36, stMales: 39770, stFemales: 40806, sexRatio: 1026, hostels: 17, students: 4940 },
        { name: "NIZAMABAD", stPopulation: 107035, stPercentage: 6.81, stMales: 52738, stFemales: 54297, sexRatio: 1030, hostels: 7, students: 949 },
        { name: "PEDDAPALLI", stPopulation: 14945, stPercentage: 1.88, stMales: 7520, stFemales: 7425, sexRatio: 987, hostels: 2, students: 116 },
        { name: "RAJANNA", stPopulation: 22990, stPercentage: 4.16, stMales: 11342, stFemales: 11648, sexRatio: 1027, hostels: 1, students: 65 },
        { name: "RANGAREDDY", stPopulation: 138710, stPercentage: 5.67, stMales: 72538, stFemales: 66172, sexRatio: 912, hostels: 7, students: 1365 },
        { name: "SANGAREDDY", stPopulation: 86710, stPercentage: 5.68, stMales: 44934, stFemales: 41776, sexRatio: 930, hostels: 10, students: 1781 },
        { name: "SIDDIPET", stPopulation: 25010, stPercentage: 2.47, stMales: 12630, stFemales: 12380, sexRatio: 980, hostels: 3, students: 709 },
        { name: "SURYAPET", stPopulation: 141271, stPercentage: 12.85, stMales: 71933, stFemales: 69338, sexRatio: 964, hostels: 13, students: 2897 },
        { name: "VIKARABAD", stPopulation: 94623, stPercentage: 10.21, stMales: 47937, stFemales: 46686, sexRatio: 974, hostels: 11, students: 3579 },
        { name: "WANAPARTHY", stPopulation: 46062, stPercentage: 7.97, stMales: 23538, stFemales: 22524, sexRatio: 957, hostels: 3, students: 682 },
        { name: "WARANGAL (R)", stPopulation: 105300, stPercentage: 14.65, stMales: 53901, stFemales: 51399, sexRatio: 954, hostels: 8, students: 1488 },
        { name: "WARANGAL (U)", stPopulation: 33306, stPercentage: 3.08, stMales: 17274, stFemales: 16032, sexRatio: 928, hostels: 7, students: 1232 },
        { name: "YADADRI", stPopulation: 43318, stPercentage: 5.86, stMales: 22450, stFemales: 20868, sexRatio: 930, hostels: 6, students: 834 }
    ],

    // Village data with remote sensing metrics
    villages: [
        { id: "V001", name: "Aathinadu", nadu: "Aathinadu", forestCover: 71.92, ndvi: 0.241, waterAccess: "ok", healthScore: 40.4, livelihoodScore: 31.7, educationScore: 31.3 },
        { id: "V002", name: "Kaliyur", nadu: "Aathinadu", forestCover: 45.11, ndvi: 0.738, waterAccess: "poor", healthScore: 79.3, livelihoodScore: 54.0, educationScore: 75.6 },
        { id: "V003", name: "Keelapatti", nadu: "Thenpuranadu", forestCover: 78.69, ndvi: 0.611, waterAccess: "poor", healthScore: 73.2, livelihoodScore: 41.8, educationScore: 57.3 },
        { id: "V004", name: "Kovilpatti (Hill)", nadu: "Kombai Nadu", forestCover: 65.79, ndvi: 0.693, waterAccess: "ok", healthScore: 75.3, livelihoodScore: 52.5, educationScore: 36.3 },
        { id: "V005", name: "Manalodai", nadu: "Vannadu", forestCover: 17.53, ndvi: 0.43, waterAccess: "poor", healthScore: 79.0, livelihoodScore: 76.9, educationScore: 60.1 },
        { id: "V006", name: "Melapatti", nadu: "Thenpuranadu", forestCover: 88.05, ndvi: 0.831, waterAccess: "ok", healthScore: 62.9, livelihoodScore: 42.9, educationScore: 35.7 },
        { id: "V007", name: "Moolakadu", nadu: "Thenpuranadu", forestCover: 70.89, ndvi: 0.781, waterAccess: "ok", healthScore: 68.4, livelihoodScore: 33.2, educationScore: 73.7 },
        { id: "V008", name: "Murungaiyur", nadu: "Kombai Nadu", forestCover: 72.89, ndvi: 0.706, waterAccess: "good", healthScore: 47.0, livelihoodScore: 45.5, educationScore: 56.2 },
        { id: "V009", name: "Nadupatti", nadu: "Kombai Nadu", forestCover: 20.25, ndvi: 0.327, waterAccess: "good", healthScore: 45.7, livelihoodScore: 46.1, educationScore: 51.7 },
        { id: "V010", name: "Pudur (Hill)", nadu: "Aathinadu", forestCover: 46.03, ndvi: 0.503, waterAccess: "ok", healthScore: 73.4, livelihoodScore: 66.4, educationScore: 46.1 },
        { id: "V011", name: "Sembulchanpatti", nadu: "Vannadu", forestCover: 39.66, ndvi: 0.228, waterAccess: "good", healthScore: 63.6, livelihoodScore: 60.6, educationScore: 69.1 },
        { id: "V012", name: "Sengattuppatti", nadu: "Thenpuranadu", forestCover: 84.14, ndvi: 0.3, waterAccess: "good", healthScore: 68.3, livelihoodScore: 73.1, educationScore: 50.3 },
        { id: "V013", name: "Sirumugai (Hill)", nadu: "Aathinadu", forestCover: 61.51, ndvi: 0.644, waterAccess: "ok", healthScore: 78.2, livelihoodScore: 66.5, educationScore: 31.1 },
        { id: "V014", name: "Sukkalampatti Kombai", nadu: "Kombai Nadu", forestCover: 75.82, ndvi: 0.684, waterAccess: "poor", healthScore: 71.7, livelihoodScore: 52.4, educationScore: 33.3 },
        { id: "V015", name: "Thenpuranadu", nadu: "Thenpuranadu", forestCover: 45.47, ndvi: 0.829, waterAccess: "ok", healthScore: 67.7, livelihoodScore: 74.8, educationScore: 92.3 },
        { id: "V016", name: "Thonur", nadu: "Vannadu", forestCover: 28.18, ndvi: 0.412, waterAccess: "poor", healthScore: 68.0, livelihoodScore: 39.2, educationScore: 88.6 },
        { id: "V017", name: "Vannadu", nadu: "Vannadu", forestCover: 54.37, ndvi: 0.441, waterAccess: "poor", healthScore: 55.2, livelihoodScore: 31.2, educationScore: 74.0 }
    ],

    // Village census data (refined to requested 5 villages in Bheempur mandal)
    villageCensus: [
        { village: "Karanji", mandal: "Bheempur", totalPop: 2232, stPop: 795, stPercentage: 35.6, literacy: 52.3, workers: 1379, agriculture: 696 },
        { village: "Guledi", mandal: "Bheempur", totalPop: 509, stPop: 117, stPercentage: 23.0, literacy: 48.9, workers: 375, agriculture: 160 },
        { village: "Gomutri", mandal: "Bheempur", totalPop: 1102, stPop: 348, stPercentage: 31.6, literacy: 46.1, workers: 665, agriculture: 301 },
        { village: "Arli (T)", mandal: "Bheempur", totalPop: 2833, stPop: 1073, stPercentage: 37.9, literacy: 47.7, workers: 1787, agriculture: 906 },
        { village: "Antargoan", mandal: "Bheempur", totalPop: 875, stPop: 129, stPercentage: 14.7, literacy: 49.7, workers: 559, agriculture: 323 }
    ],

    // Full 10 villages for Bheempur mandal to power village-wise pie chart
    bheempurVillages10: [
        { village: "Karanji", mandal: "Bheempur", totalPop: 2232, stPop: 795, stPercentage: 35.6, literacy: 52.3, workers: 1379, agriculture: 696 },
        { village: "Guledi", mandal: "Bheempur", totalPop: 509, stPop: 117, stPercentage: 23.0, literacy: 48.9, workers: 375, agriculture: 160 },
        { village: "Gomutri", mandal: "Bheempur", totalPop: 1102, stPop: 348, stPercentage: 31.6, literacy: 46.1, workers: 665, agriculture: 301 },
        { village: "Antargoan", mandal: "Bheempur", totalPop: 875, stPop: 129, stPercentage: 14.7, literacy: 49.7, workers: 559, agriculture: 323 },
        { village: "Arli (T)", mandal: "Bheempur", totalPop: 2833, stPop: 1073, stPercentage: 37.9, literacy: 47.7, workers: 1787, agriculture: 906 },
        { village: "Wadoor", mandal: "Bheempur", totalPop: 1194, stPop: 106, stPercentage: 8.9, literacy: 43.7, workers: 697, agriculture: 165 },
        { village: "Dhanora", mandal: "Bheempur", totalPop: 1052, stPop: 84, stPercentage: 8.0, literacy: 55.0, workers: 578, agriculture: 158 },
        { village: "Kamathwada", mandal: "Bheempur", totalPop: 371, stPop: 288, stPercentage: 77.6, literacy: 46.1, workers: 182, agriculture: 36 },
        { village: "Gona", mandal: "Bheempur", totalPop: 469, stPop: 210, stPercentage: 44.8, literacy: 56.9, workers: 240, agriculture: 26 },
        { village: "Gunjala", mandal: "Bheempur", totalPop: 876, stPop: 827, stPercentage: 94.4, literacy: 48.7, workers: 481, agriculture: 419 }
    ],

    // Government schemes data
    schemes: [
        {
            name: "Pradhan Mantri Van Dhan Yojana (PMVDY)",
            eligibility: "Tribal SHGs / forest-dwelling communities registered under Van Dhan Kendras",
            ministry: "Ministry of Tribal Affairs (MoTA)",
            benefits: "Skill training, working capital, tools/machinery, market linkages for forest produce",
            rule: "If village economy depends on MFP collection ? Suggest PMVDY support",
            priority: "high"
        },
        {
            name: "Eklavya Model Residential Schools (EMRS)",
            eligibility: "ST children, classes 6–12, from tribal-dominated blocks",
            ministry: "Ministry of Tribal Affairs (MoTA)",
            benefits: "Free schooling, hostel, meals, uniforms for ST children",
            rule: "If literacy < 50% OR no secondary school nearby ? Suggest EMRS admission",
            priority: "high"
        },
        {
            name: "National Fellowship & Scholarship for ST Students",
            eligibility: "ST certificate, family income ≤ ₹6 lakh, pursuing higher education",
            ministry: "Ministry of Tribal Affairs (MoTA)",
            benefits: "Scholarship covers tuition fees, maintenance allowance, contingency grant",
            rule: "If student eligible for UG/PG/PhD and ST ? Suggest Scholarship",
            priority: "medium"
        },
        {
            name: "Pre-Matric & Post-Matric ST Scholarships",
            eligibility: "ST students, income ≤ ₹2.5 lakh, enrolled in Class 9 onwards",
            ministry: "MoTA / State Tribal Welfare Departments",
            benefits: "Full fee reimbursement, books, hostel allowance",
            rule: "If ST student in school/college and income ≤ threshold ? Suggest Scholarship",
            priority: "high"
        },
        {
            name: "Stand-Up India Scheme",
            eligibility: "SC/ST or women entrepreneur, loan ₹10L–₹1Cr, greenfield enterprise",
            ministry: "Ministry of Finance",
            benefits: "Bank loan support for starting enterprises, credit + handholding support",
            rule: "If ST individual wants entrepreneurship ? Suggest Stand-Up India loan",
            priority: "medium"
        },
        {
            name: "PM JANMAN (Particularly Vulnerable Tribal Groups)",
            eligibility: "Members of PVTGs (e.g., Toda, Chenchu, Birhor)",
            ministry: "Ministry of Tribal Affairs (MoTA)",
            benefits: "Housing, education, health, livelihood, water, sanitation support",
            rule: "If village classified as PVTG ? Suggest PM JANMAN package",
            priority: "high"
        },
        {
            name: "Forest Rights Act (FRA) Benefits",
            eligibility: "ST/OTFD, proof of habitation before 2005",
            ministry: "MoTA / MoEFCC",
            benefits: "Legal title to IFR/CR/CFR land, access to forest resources",
            rule: "If FRA claim granted ? Recognize rights + enable access to schemes",
            priority: "high"
        },
        {
            name: "Tribal Sub-Plan (TSP) / ST Component (STC)",
            eligibility: "All ST households",
            ministry: "All ministries via MoTA coordination",
            benefits: "Special allocation of funds for tribal welfare across ministries",
            rule: "If ST-majority village ? Prioritize TSP budget schemes",
            priority: "medium"
        },
        {
            name: "Jal Jeevan Mission (Har Ghar Jal)",
            eligibility: "All rural households, priority to tribal/remote villages",
            ministry: "Ministry of Jal Shakti",
            benefits: "Household piped drinking water connection, village infrastructure",
            rule: "If water_access = poor ? Suggest Jal Jeevan Mission",
            priority: "high"
        },
        {
            name: "MGNREGA",
            eligibility: "All rural households (incl. tribal), with job card",
            ministry: "Ministry of Rural Development",
            benefits: "100 days guaranteed wage employment per household",
            rule: "If FRA patta land undeveloped OR unemployment high ? Suggest MGNREGA work",
            priority: "medium"
        },
        {
            name: "PM-KISAN",
            eligibility: "Land-owning farmers incl. FRA patta holders",
            ministry: "Ministry of Agriculture & Farmers Welfare",
            benefits: "₹6,000 per year in 3 equal installments to farmers",
            rule: "If FRA patta granted (agricultural land) ? Suggest PM-KISAN enrollment",
            priority: "medium"
        },
        {
            name: "National Health Mission – Tribal Health",
            eligibility: "All tribal villages, women, children",
            ministry: "Ministry of Health & Family Welfare",
            benefits: "Free health services, mobile clinics, nutrition programs",
            rule: "If high maternal/child mortality OR poor health index ? Suggest NHM tribal package",
            priority: "high"
        },
        {
            name: "ST Hostels for Boys & Girls",
            eligibility: "ST students enrolled in schools/colleges",
            ministry: "MoTA / State Tribal Welfare",
            benefits: "Free hostel accommodation, food, uniforms",
            rule: "If dropout risk OR distance to school > 5km ? Suggest hostel facility",
            priority: "medium"
        },
        {
            name: "DAJKUA / DAJGUA Convergence",
            eligibility: "FRA title-holders (IFR/CR/CFR)",
            ministry: "MoTA + Ministries of Agriculture, Jal Shakti, Rural Development",
            benefits: "Layered support: land development, irrigation, housing, livelihood assets",
            rule: "If FRA patta granted ? Layer DAJGUA schemes (land dev, irrigation, housing)",
            priority: "high"
        }
    ]
};

// Data processing functions
function calculateTotalSTPopulation() {
    return tribalData.districts.reduce((total, district) => total + district.stPopulation, 0);
}

function calculateTotalHostels() {
    return tribalData.districts.reduce((total, district) => total + district.hostels, 0);
}

function calculateTotalStudents() {
    return tribalData.districts.reduce((total, district) => total + district.students, 0);
}

function calculateAverageSTPercentage() {
    const totalPercentage = tribalData.districts.reduce((total, district) => total + district.stPercentage, 0);
    return (totalPercentage / tribalData.districts.length).toFixed(1);
}

// Scheme recommendation logic based on DSS rules
function getSchemeRecommendations(formData) {
    const recommendations = [];
    
    // Calculate derived metrics
    const stPercentage = (formData.stPopulation / formData.totalPopulation) * 100;
    const isSTMajority = stPercentage > 50;
    const isHighST = stPercentage > 30;
    const isLowLiteracy = formData.literacyRate < 50;
    const isPoorWater = formData.waterAccess === 'poor';
    const isHighUnemployment = formData.unemploymentRate > 20;
    const isHighHealthRisk = formData.healthScore < 50;
    const isHighMFP = formData.mfpDependency === 'high' || formData.mfpDependency === 'medium';
    const isFarFromSchool = formData.distanceToSchool > 5;
    const isLowIncome = formData.familyIncome < 250000; // 2.5 lakh threshold
    
    // Apply DSS rules
    tribalData.schemes.forEach(scheme => {
        let shouldRecommend = false;
        let reason = "";
        
        switch (scheme.name) {
            case "Pradhan Mantri Van Dhan Yojana (PMVDY)":
                if (isHighMFP && formData.forestCover > 50) {
                    shouldRecommend = true;
                    reason = "High forest cover and MFP dependency detected";
                }
                break;
                
            case "Eklavya Model Residential Schools (EMRS)":
                if ((isLowLiteracy || isFarFromSchool) && isHighST) {
                    shouldRecommend = true;
                    reason = "Low literacy or far from school with high ST population";
                }
                break;
                
            case "National Fellowship & Scholarship for ST Students":
                if (isSTMajority && formData.familyIncome <= 600000) {
                    shouldRecommend = true;
                    reason = "ST majority village with eligible income level";
                }
                break;
                
            case "Pre-Matric & Post-Matric ST Scholarships":
                if (isSTMajority && isLowIncome) {
                    shouldRecommend = true;
                    reason = "ST majority village with low family income";
                }
                break;
                
            case "Stand-Up India Scheme":
                if (isSTMajority && formData.familyIncome <= 1000000) {
                    shouldRecommend = true;
                    reason = "ST majority village eligible for entrepreneurship support";
                }
                break;
                
            case "PM JANMAN (Particularly Vulnerable Tribal Groups)":
                if (formData.isPVTG === 'yes') {
                    shouldRecommend = true;
                    reason = "Village classified as PVTG";
                }
                break;
                
            case "Forest Rights Act (FRA) Benefits":
                if (formData.hasFRA === 'yes') {
                    shouldRecommend = true;
                    reason = "FRA patta already granted - enable access to related schemes";
                }
                break;
                
            case "Tribal Sub-Plan (TSP) / ST Component (STC)":
                if (isSTMajority) {
                    shouldRecommend = true;
                    reason = "ST majority village - prioritize TSP budget allocation";
                }
                break;
                
            case "Jal Jeevan Mission (Har Ghar Jal)":
                if (isPoorWater) {
                    shouldRecommend = true;
                    reason = "Poor water access detected";
                }
                break;
                
            case "MGNREGA":
                if ((formData.hasFRA === 'yes' && formData.livelihoodScore < 50) || isHighUnemployment) {
                    shouldRecommend = true;
                    reason = "FRA land undeveloped or high unemployment";
                }
                break;
                
            case "PM-KISAN":
                if (formData.hasFRA === 'yes') {
                    shouldRecommend = true;
                    reason = "FRA patta granted for agricultural land";
                }
                break;
                
            case "National Health Mission – Tribal Health":
                if (isHighHealthRisk || isSTMajority) {
                    shouldRecommend = true;
                    reason = "High health risk or ST majority village";
                }
                break;
                
            case "ST Hostels for Boys & Girls":
                if (isFarFromSchool || (isLowLiteracy && isHighST)) {
                    shouldRecommend = true;
                    reason = "Far from school or dropout risk with high ST population";
                }
                break;
                
            case "DAJKUA / DAJGUA Convergence":
                if (formData.hasFRA === 'yes') {
                    shouldRecommend = true;
                    reason = "FRA patta granted - enable layered support schemes";
                }
                break;
        }
        
        if (shouldRecommend) {
            recommendations.push({
                ...scheme,
                reason: reason,
                stPercentage: stPercentage.toFixed(1)
            });
        }
    });
    
    // Sort by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations;
}

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        tribalData,
        calculateTotalSTPopulation,
        calculateTotalHostels,
        calculateTotalStudents,
        calculateAverageSTPercentage,
        getSchemeRecommendations
    };
}
