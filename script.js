// Dados simulados de peneiras de futebol
const peneirasData = [
    {
        id: 1,
        titulo: "Peneira Sub-16 e Sub-17",
        clube: "Base - Atlético Mineiro",
        endereco: null,
        data: "2025-08-10",
        horario: "14:00",
        categoria: "Sub-16 até Sub-17",
        requisitos: "Idade Entre 16-17 anos",
        contato: "(13) 3257-4000",
        distancia: 2.5,
        lat: -23.9618,
        lng: -46.3322,
        status: "aberta",
        vagasDisponiveis: 8,
        totalVagas: 60,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    },
    {
        id: 2,
        titulo: "Peneira Sub-08",
        clube: "Base - Paysandu FC",
        endereco: null,
        data: "2025-08-10",
        horario: "09:00",
        categoria: "Sub-09",
        requisitos: "Idade entre 08-09 anos",
        contato: "(11) 3670-8100",
        distancia: 5.8,
        lat: -23.5505,
        lng: -46.6333,
        status: "encerrada",
        vagasDisponiveis: 0,
        totalVagas: 40,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: true
    },
    {
        id: 3,
        titulo: "Peneira Sub-09 até Sub-12",
        clube: "Base - Internacional FC",
        endereco: null,
        data: "2025-08-10",
        horario: "15:30",
        categoria: "Sub-09 até Sub-12",
        requisitos: "Idade entre 09-12 anos",
        contato: "(11) 2095-3000",
        distancia: 8.2,
        lat: -23.5629,
        lng: -46.6544,
        status: "aberta",
        vagasDisponiveis: 3,
        totalVagas: 70,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    },
    {
        id: 4,
        titulo: "Peneira Sub-13 até Sub-15",
        clube: "Base - Água Santa FC",
        endereco: null,
        data: "2025-08-10",
        horario: "10:00",
        categoria: "Sub-13 até Sub-15",
        requisitos: "Idade entre 13-15 anos",
        contato: "(11) 3873-2400",
        distancia: 12.1,
        lat: -23.5629,
        lng: -46.6544,
        status: "aberta",
        vagasDisponiveis: 9,
        totalVagas: 60,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    },
    {
        id: 5,
        titulo: "Peneira Sub-18 até Sub-21",
        clube: "Red Bull Bragantino",
        endereco: null,
        data: "2025-08-10",
        horario: "13:00",
        categoria: "Sub-18 até Sub-21",
        requisitos: "Idade entre 18-21 anos",
        contato: "(11) 4034-1900",
        distancia: 45.3,
        lat: -22.9519,
        lng: -46.5428,
        status: "encerrada",
        vagasDisponiveis: 0,
        totalVagas: 25,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: true
    },
    {
        id: 6,
        titulo: "Peneira Sub-21 +",
        clube: "Ponte Preta",
        endereco: null,
        data: "2025-08-10",
        horario: "14:30",
        categoria: "Sub-21 +",
        requisitos: "Idade 21 +",
        contato: "(19) 3231-3444",
        distancia: 35.7,
        lat: -22.9056,
        lng: -47.0608,
        status: "aberta",
        vagasDisponiveis: 7,
        totalVagas: 85,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    }
];

const enderecoCache = new Map();

async function buscarEnderecoPorCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (enderecoCache.has(cepLimpo)) {
        return enderecoCache.get(cepLimpo);
    }
    
    if (cepLimpo.length !== 8) {
        return 'CEP inválido';
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        
        if (!data.localidade || !data.uf) {
            throw new Error('Dados incompletos');
        }
        
        const endereco = `${data.localidade}, ${data.uf}`;
        enderecoCache.set(cepLimpo, endereco);
        
        return endereco;
    } catch (error) {
        return 'Localização não disponível';
    }
}

let userLocation = null;
let currentResults = [];
let currentFilter = 'all';
let expandedCategories = new Set();

const cepInput = document.getElementById('cep-input');
const getLocationBtn = document.getElementById('get-location-btn');
const searchBtn = document.getElementById('search-btn');
const resultsSection = document.getElementById('results');
const resultsContainer = document.getElementById('results-container');
const noResults = document.getElementById('no-results');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingAddress = document.getElementById('loading-address');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const backToTopBtn = document.getElementById('back-to-top');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando aplicação...');
    
    searchBtn.addEventListener('click', handleSearch);
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    getLocationBtn.addEventListener('click', getCurrentLocation);
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            cepInput.value = location;
            handleSearch();
        });
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            applyFilter(filter);
        });
    });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    window.addEventListener('scroll', handleScroll);
    
    setupScrollAnimations();
    animateStats();
    setupScrollIndicator();
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (scrollY > 500) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.opacity = '1';
    } else {
        backToTopBtn.style.opacity = '0';
        setTimeout(() => {
            if (window.scrollY <= 500) {
                backToTopBtn.style.display = 'none';
            }
        }, 300);
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function setupScrollIndicator() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            document.getElementById('como-funciona').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('pt-BR');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
        }
    }, 30);
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.step-card, .feature-card, .testimonial-card');
    elements.forEach(el => observer.observe(el));
}

function showLoading(show) {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

function hideLoading() {
    showLoading(false);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

async function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocalização não suportada pelo seu navegador.', 'warning');
        return;
    }
    
    showLoading(true);
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const location = await reverseGeocode(latitude, longitude);
                cepInput.value = location;
                hideLoading();
                handleSearch();
            } catch (error) {
                hideLoading();
                showNotification('Erro ao obter localização.', 'error');
            }
        },
        (error) => {
            hideLoading();
            showNotification('Erro ao obter localização: ' + error.message, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

function reverseGeocode(lat, lng) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const cities = [
                { name: "São Paulo, SP", lat: -23.5505, lng: -46.6333 },
                { name: "Rio de Janeiro, RJ", lat: -22.9068, lng: -43.1729 },
                { name: "Belo Horizonte, MG", lat: -19.9167, lng: -43.9345 },
                { name: "Porto Alegre, RS", lat: -30.0346, lng: -51.2177 },
                { name: "Salvador, BA", lat: -12.9714, lng: -38.5014 },
                { name: "Brasília, DF", lat: -15.8267, lng: -47.9218 }
            ];
            
            let closestCity = cities[0];
            let minDistance = calculateDistance(lat, lng, cities[0].lat, cities[0].lng);
            
            cities.forEach(city => {
                const distance = calculateDistance(lat, lng, city.lat, city.lng);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCity = city;
                }
            });
            
            resolve(closestCity.name);
        }, 1000);
    });
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

async function handleSearch() {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        showNotification('Por favor, digite um CEP válido com 8 dígitos.', 'warning');
        cepInput.focus();
        return;
    }

    showLoading(true);

    try {
        const enderecoUsuario = await buscarEnderecoPorCEP(cep);
        
        if (enderecoUsuario === 'CEP inválido' || enderecoUsuario === 'Localização não disponível') {
            showNotification('CEP não encontrado. Verifique o número digitado.', 'error');
            hideLoading();
            return;
        }

        peneirasData.forEach(peneira => {
            peneira.endereco = enderecoUsuario;
        });

        loadingAddress.textContent = `Buscando peneiras próximas a ${enderecoUsuario}`;
        document.getElementById('loading-neighborhood').textContent = ``;

        setTimeout(() => {
            searchPeneiras(enderecoUsuario);
        }, 4000);

    } catch (error) {
        showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
        hideLoading();
    }
}

function searchPeneiras(location) {
    try {
        const userCoords = geocodeLocation(location);
        
        const results = peneirasData.map(peneira => {
            const distance = calculateDistance(
                userCoords.lat, userCoords.lng,
                peneira.lat, peneira.lng
            );
            
            return {
                ...peneira,
                distancia: Math.round(distance * 10) / 10
            };
        }).sort((a, b) => a.distancia - b.distancia);
        
        currentResults = results.filter(peneira => peneira.distancia <= 100);
        
        hideLoading();
        displayResults(currentResults);
        
    } catch (error) {
        hideLoading();
        showNotification('Erro ao buscar peneiras. Tente novamente.', 'error');
    }
}

function geocodeLocation(location) {
    const locationMap = {
        'são paulo': { lat: -23.5505, lng: -46.6333 },
        'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
        'belo horizonte': { lat: -19.9167, lng: -43.9345 },
        'porto alegre': { lat: -30.0346, lng: -51.2177 },
        'salvador': { lat: -12.9714, lng: -38.5014 },
        'brasília': { lat: -15.8267, lng: -47.9218 },
        'santos': { lat: -23.9618, lng: -46.3322 },
        'campinas': { lat: -22.9056, lng: -47.0608 }
    };
    
    const normalizedLocation = location.toLowerCase();
    
    for (const [key, coords] of Object.entries(locationMap)) {
        if (normalizedLocation.includes(key) || key.includes(normalizedLocation.split(',')[0].trim().toLowerCase())) {
            return coords;
        }
    }
    
    return locationMap['são paulo'];
}

function setActiveFilter(filter) {
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    currentFilter = filter;
}

function applyFilter(filter) {
    let filteredResults = [...currentResults];
    
    switch (filter) {
        case 'distance':
            filteredResults.sort((a, b) => a.distancia - b.distancia);
            break;
        case 'date':
            filteredResults.sort((a, b) => new Date(a.data) - new Date(b.data));
            break;
        default:
            break;
    }
    
    displayResults(filteredResults);
}

// ========== FUNÇÃO PRINCIPAL: EXIBIR RESULTADOS COM AGRUPAMENTO ==========
function displayResults(results) {
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    if (results.length === 0) {
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    // Agrupar peneiras por categoria
    const categoriesMap = new Map();
    
    results.forEach(peneira => {
        if (!categoriesMap.has(peneira.categoria)) {
            categoriesMap.set(peneira.categoria, []);
        }
        categoriesMap.get(peneira.categoria).push(peneira);
    });
    
    // Criar lista de categorias
    const categoriesList = document.createElement('div');
    categoriesList.className = 'categories-list';
    
    let categoryIndex = 0;
    categoriesMap.forEach((peneiras, categoria) => {
        const ativasCount = peneiras.filter(p => p.status === 'aberta').length;
        const totalCount = peneiras.length;
        
        const categoryItem = createCategoryItem(categoria, peneiras, ativasCount, totalCount, categoryIndex);
        categoriesList.appendChild(categoryItem);
        categoryIndex++;
    });
    
    resultsContainer.appendChild(categoriesList);
}

// ========== CRIAR ITEM DE CATEGORIA ==========
function createCategoryItem(categoria, peneiras, ativasCount, totalCount, index) {
    const categoryId = `category-${index}`;
    
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    
    const statusIcon = ativasCount > 0 ? 'check-circle' : 'times-circle';
    const statusClass = ativasCount > 0 ? 'active' : 'inactive';
    
    categoryItem.innerHTML = `
        <div class="category-header ${statusClass}">
            <div class="category-info">
                <i class="fas fa-${statusIcon} category-status-icon"></i>
                <div class="category-text">
                    <h3 class="category-name">${categoria}</h3>
                    <p class="category-count">${ativasCount} peneira${ativasCount !== 1 ? 's' : ''} ativa${ativasCount !== 1 ? 's' : ''}</p>
                </div>
            </div>
            <div class="category-toggle">
                <i class="fas fa-chevron-down toggle-icon"></i>
            </div>
        </div>
        <div class="category-content" style="display: none;">
            <div class="peneiras-grid"></div>
        </div>
    `;
    
    // Adicionar event listener para expandir/colapsar
    const categoryHeader = categoryItem.querySelector('.category-header');
    const categoryContent = categoryItem.querySelector('.category-content');
    const peneirasGrid = categoryContent.querySelector('.peneiras-grid');
    
    categoryHeader.addEventListener('click', function() {
        const isHidden = categoryContent.style.display === 'none';
        
        if (isHidden) {
            // Expandir
            categoryContent.style.display = 'block';
            categoryHeader.querySelector('.toggle-icon').style.transform = 'rotate(180deg)';
            
            // Renderizar cards se estiver vazio
            if (peneirasGrid.children.length === 0) {
                peneiras.forEach((peneira, idx) => {
                    const resultCard = createResultCard(peneira);
                    peneirasGrid.appendChild(resultCard);
                    
                    setTimeout(() => {
                        resultCard.classList.add('animate-fade-in-up');
                    }, idx * 100);
                });
            }
        } else {
            // Colapsar
            categoryContent.style.display = 'none';
            categoryHeader.querySelector('.toggle-icon').style.transform = 'rotate(0deg)';
        }
    });
    
    return categoryItem;
}

// ========== CRIAR CARD DE RESULTADO ==========
function createResultCard(peneira) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const dataFormatada = formatDate(peneira.data);
    const distanciaTexto = peneira.distancia < 1 ? 
        `${Math.round(peneira.distancia * 1000)}m` : 
        `${peneira.distancia}km`;
    
    const statusInfo = getStatusInfo(peneira);
    const vagasInfo = getVagasInfo(peneira);
    const prazoInfo = getPrazoInfo(peneira);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-title-section">
                <h3 class="card-title">${peneira.titulo}</h3>
                <p class="card-club">${peneira.clube}</p>
            </div>
            <div class="card-badges">
                <span class="distance-badge">${distanciaTexto}</span>
                ${statusInfo.badge}
            </div>
        </div>
        
        ${statusInfo.banner}
        
        <div class="card-content">
            <div class="event-details">
                <div class="detail-row primary">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${dataFormatada} às ${peneira.horario}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${peneira.endereco || 'Endereço será definido após busca'}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-users"></i>
                    <span>${peneira.categoria}</span>
                </div>
            </div>
            
            ${vagasInfo.html}
            ${prazoInfo.html}
        </div>
        
        <div class="card-actions">
            ${peneira.status === 'aberta' ? `
                <button class="btn-primary" onclick="openPeneiraModal(${peneira.id})">
                    <i class="fas fa-futbol"></i>
                    <span>Quero Participar</span>
                </button>
            ` : `
                <button class="btn-disabled" disabled>
                    <i class="fas fa-lock"></i>
                    <span>Encerrada</span>
                </button>
            `}
        </div>
    `;
    
    card.classList.add(`card-${peneira.status}`);
    
    return card;
}

function getStatusInfo(peneira) {
    if (peneira.status === 'encerrada') {
        return {
            badge: '<span class="status-badge status-closed">Encerrada</span>',
            banner: '<div class="status-banner closed"><i class="fas fa-times-circle"></i><span>Inscrições Encerradas</span></div>'
        };
    }
    
    if (peneira.inscricaoEncerrada) {
        return {
            badge: '<span class="status-badge status-warning">Prazo Vencido</span>',
            banner: '<div class="status-banner warning"><i class="fas fa-exclamation-triangle"></i><span>Prazo de Inscrição Vencido</span></div>'
        };
    }
    
    return {
        badge: '<span class="status-badge status-open">Aberta</span>',
        banner: ''
    };
}

function getVagasInfo(peneira) {
    if (peneira.status === 'encerrada') {
        return { html: '' };
    }
    
    const percentualPreenchido = ((peneira.totalVagas - peneira.vagasDisponiveis) / peneira.totalVagas) * 100;
    const statusVagas = peneira.vagasDisponiveis <= 3 ? 'critical' : peneira.vagasDisponiveis <= 10 ? 'warning' : 'normal';
    
    return {
        html: `
            <div class="vagas-section">
                <div class="vagas-header">
                    <span class="vagas-label">Vagas Disponíveis</span>
                    <span class="vagas-count ${statusVagas}">${peneira.vagasDisponiveis}/${peneira.totalVagas}</span>
                </div>
                <div class="vagas-bar">
                    <div class="vagas-progress" style="width: ${percentualPreenchido}%"></div>
                </div>
            </div>
        `
    };
}

function getPrazoInfo(peneira) {
    if (peneira.status === 'encerrada') {
        return { html: '' };
    }
    
    const prazoFormatado = formatDate(peneira.prazoInscricao);
    const diasRestantes = Math.ceil((new Date(peneira.prazoInscricao) - new Date()) / (1000 * 60 * 60 * 24));
    const statusPrazo = diasRestantes <= 2 ? 'critical' : diasRestantes <= 7 ? 'warning' : 'normal';
    
    return {
        html: `
            <div class="prazo-section">
                <i class="fas fa-hourglass-end"></i>
                <span class="prazo-text">Prazo: <strong class="prazo-date ${statusPrazo}">${prazoFormatado}</strong></span>
            </div>
        `
    };
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function openPeneiraModal(peneiraId) {
    const peneira = peneirasData.find(p => p.id === peneiraId);
    if (peneira) {
        console.log('Abrindo modal para peneira:', peneira);
        showNotification(`Você se inscreveu em: ${peneira.titulo}`, 'success');
    }
}
