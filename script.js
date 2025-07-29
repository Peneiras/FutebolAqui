// Dados simulados de peneiras de futebol - VERSÃƒO SIMPLIFICADA
const peneirasData = [
    {
        id: 1,
        titulo: "Peneira Sub-16 e Sub-17",
        clube: "Base - AtlÃ©tico Mineiro",
        endereco: null, // SerÃ¡ preenchido com o CEP do usuÃ¡rio
        data: "2025-08-10",
        horario: "14:00",
        categoria: "Sub-16 atÃ© Sub-17",
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
        endereco: null, // SerÃ¡ preenchido com o CEP do usuÃ¡rio
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
        titulo: "Peneira Sub-09 atÃ© Sub-12",
        clube: "Base - Internacional FC",
        endereco: null, // SerÃ¡ preenchido com o CEP do usuÃ¡rio
        data: "2025-08-10",
        horario: "15:30",
        categoria: "Sub-09 atÃ© Sub-12",
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
        titulo: "Peneira Sub-13 atÃ© Sub-15",
        clube: "Base - Ãgua Santa FC",
        endereco: null, // SerÃ¡ preenchido com o CEP do usuÃ¡rio
        data: "2025-08-10",
        horario: "10:00",
        categoria: "Sub-13 atÃ© Sub-15",
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
        titulo: "Peneira Sub-18 atÃ© Sub-21",
        clube: "Red Bull Bragantino",
        endereco: null, // SerÃ¡ preenchido com o CEP do usuÃ¡rio
        data: "2025-08-10",
        horario: "13:00",
        categoria: "Sub-18 atÃ© Sub-21",
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
        endereco: null, // SerÃ¡ preenchido com o CEP do usuÃ¡rio
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

// Cache para armazenar endereÃ§os jÃ¡ consultados
const enderecoCache = new Map();

// FunÃ§Ã£o para buscar endereÃ§o por CEP via ViaCEP
async function buscarEnderecoPorCEP(cep) {
    // Limpar CEP (remover hÃ­fen e espaÃ§os)
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Verificar se jÃ¡ estÃ¡ no cache
    if (enderecoCache.has(cepLimpo)) {
        console.log(`CEP ${cep} encontrado no cache:`, enderecoCache.get(cepLimpo));
        return enderecoCache.get(cepLimpo);
    }
    
    // Validar formato do CEP
    if (cepLimpo.length !== 8) {
        console.error(`CEP invÃ¡lido: ${cep} (deve ter 8 dÃ­gitos)`);
        return 'CEP invÃ¡lido';
    }
    
    try {
        console.log(`Buscando CEP ${cep} (${cepLimpo}) na API ViaCEP...`);
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Resposta da API para CEP ${cep}:`, data);
        
        if (data.erro) {
            throw new Error('CEP nÃ£o encontrado na base de dados');
        }
        
        if (!data.localidade || !data.uf) {
            throw new Error('Dados incompletos retornados pela API');
        }
        
        const endereco = `${data.localidade}, ${data.uf}`;
        console.log(`EndereÃ§o formatado para CEP ${cep}: ${endereco}`);
        
        // Armazenar no cache
        enderecoCache.set(cepLimpo, endereco);
        
        return endereco;
    } catch (error) {
        console.error(`Erro ao buscar CEP ${cep}:`, error.message);
        // Retornar um endereÃ§o padrÃ£o em caso de erro
        return 'LocalizaÃ§Ã£o nÃ£o disponÃ­vel';
    }
}

// VariÃ¡veis globais
let userLocation = null;
let currentResults = [];
let currentFilter = 'all';

// Elementos DOM
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando aplicaÃ§Ã£o...');
    
    // Event listeners para busca
    searchBtn.addEventListener('click', handleSearch);
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Event listener para obter localizaÃ§Ã£o atual
    getLocationBtn.addEventListener('click', getCurrentLocation);
    
    // Event listeners para sugestÃµes
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            cepInput.value = location;
            handleSearch();
        });
    });
    
    // Event listeners para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            applyFilter(filter);
        });
    });
    
    // Event listener para menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // Event listener para botÃ£o voltar ao topo
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Event listeners para scroll
    window.addEventListener('scroll', handleScroll);
    
    // AnimaÃ§Ãµes de scroll
    setupScrollAnimations();
    
    // AnimaÃ§Ã£o dos nÃºmeros das estatÃ­sticas
    animateStats();
    
    // Configurar indicador de scroll
    setupScrollIndicator();
}

// FunÃ§Ã£o para alternar menu mobile
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// FunÃ§Ã£o para fechar menu mobile
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// FunÃ§Ã£o para lidar com scroll
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Header com efeito de scroll
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // BotÃ£o voltar ao topo
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

// FunÃ§Ã£o para voltar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// FunÃ§Ã£o para configurar indicador de scroll
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

// FunÃ§Ã£o para animar estatÃ­sticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// FunÃ§Ã£o para animar nÃºmeros
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'k+';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 20);
}

// FunÃ§Ã£o para obter localizaÃ§Ã£o atual do usuÃ¡rio
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('GeolocalizaÃ§Ã£o nÃ£o Ã© suportada pelo seu navegador', 'error');
        return;
    }
    
    showLoading();
    getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Simular busca de endereÃ§o reverso
            reverseGeocode(userLocation.lat, userLocation.lng)
                .then(address => {
                    cepInput.value = address;
                    hideLoading();
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    handleSearch();
                })
                .catch(error => {
                    hideLoading();
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    showNotification('Erro ao obter endereÃ§o', 'error');
                });
        },
        function(error) {
            hideLoading();
            getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
            
            let message = 'Erro ao obter localizaÃ§Ã£o';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = 'PermissÃ£o de localizaÃ§Ã£o negada';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'LocalizaÃ§Ã£o indisponÃ­vel';
                    break;
                case error.TIMEOUT:
                    message = 'Tempo limite excedido';
                    break;
            }
            showNotification(message, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// FunÃ§Ã£o simulada de geocodificaÃ§Ã£o reversa
function reverseGeocode(lat, lng) {
    return new Promise((resolve, reject) => {
        // Simular delay de API
        setTimeout(() => {
            // Coordenadas aproximadas de algumas cidades brasileiras
            const cities = [
                { name: "SÃ£o Paulo, SP", lat: -23.5505, lng: -46.6333 },
                { name: "Rio de Janeiro, RJ", lat: -22.9068, lng: -43.1729 },
                { name: "Belo Horizonte, MG", lat: -19.9167, lng: -43.9345 },
                { name: "Porto Alegre, RS", lat: -30.0346, lng: -51.2177 },
                { name: "Salvador, BA", lat: -12.9714, lng: -38.5014 },
                { name: "BrasÃ­lia, DF", lat: -15.8267, lng: -47.9218 }
            ];
            
            // Encontrar cidade mais prÃ³xima
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

// FunÃ§Ã£o para calcular distÃ¢ncia entre duas coordenadas
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// FunÃ§Ã£o principal de busca
async function handleSearch() {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        showNotification('Por favor, digite um CEP vÃ¡lido com 8 dÃ­gitos.', 'warning');
        cepInput.focus();
        return;
    }

    showLoading(true);

    try {
        console.log(`Buscando endereÃ§o para CEP do usuÃ¡rio: ${cep}`);
        
        // Buscar endereÃ§o do CEP digitado pelo usuÃ¡rio
        const enderecoUsuario = await buscarEnderecoPorCEP(cep);
        
        if (enderecoUsuario === 'CEP invÃ¡lido' || enderecoUsuario === 'LocalizaÃ§Ã£o nÃ£o disponÃ­vel') {
            showNotification('CEP nÃ£o encontrado. Verifique o nÃºmero digitado.', 'error');
            hideLoading();
            return;
        }

        console.log(`EndereÃ§o do usuÃ¡rio encontrado: ${enderecoUsuario}`);
        
        // Aplicar o endereÃ§o do usuÃ¡rio a TODAS as peneiras
        peneirasData.forEach(peneira => {
            peneira.endereco = enderecoUsuario;
        });
        
        console.log(`EndereÃ§o "${enderecoUsuario}" aplicado a todas as ${peneirasData.length} peneiras`);

        loadingAddress.textContent = `Buscando peneiras prÃ³ximas a ${enderecoUsuario}`;
        document.getElementById('loading-neighborhood').textContent = ``;

        // Simular delay de busca
        setTimeout(() => {
            searchPeneiras(enderecoUsuario);
        }, 4000);

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
        hideLoading();
    }
}

// FunÃ§Ã£o para buscar peneiras
function searchPeneiras(location) {
    try {
        // Simular geocodificaÃ§Ã£o da localizaÃ§Ã£o digitada
        const userCoords = geocodeLocation(location);
        
        // Calcular distÃ¢ncias e filtrar resultados
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
        
        // Filtrar apenas peneiras em um raio de 100km
        currentResults = results.filter(peneira => peneira.distancia <= 100);
        
        hideLoading();
        displayResults(currentResults);
        
    } catch (error) {
        hideLoading();
        showNotification('Erro ao buscar peneiras. Tente novamente.', 'error');
    }
}

// FunÃ§Ã£o simulada de geocodificaÃ§Ã£o
function geocodeLocation(location) {
    // Coordenadas simuladas baseadas na localizaÃ§Ã£o
    const locationMap = {
        'sÃ£o paulo': { lat: -23.5505, lng: -46.6333 },
        'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
        'belo horizonte': { lat: -19.9167, lng: -43.9345 },
        'porto alegre': { lat: -30.0346, lng: -51.2177 },
        'salvador': { lat: -12.9714, lng: -38.5014 },
        'brasÃ­lia': { lat: -15.8267, lng: -47.9218 },
        'santos': { lat: -23.9618, lng: -46.3322 },
        'campinas': { lat: -22.9056, lng: -47.0608 }
    };
    
    const normalizedLocation = location.toLowerCase();
    
    // Procurar por correspondÃªncia parcial
    for (const [key, coords] of Object.entries(locationMap)) {
        if (normalizedLocation.includes(key) || key.includes(normalizedLocation.split(',')[0].trim().toLowerCase())) {
            return coords;
        }
    }
    
    // Retornar SÃ£o Paulo como padrÃ£o
    return locationMap['sÃ£o paulo'];
}

// FunÃ§Ã£o para definir filtro ativo
function setActiveFilter(filter) {
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    currentFilter = filter;
}

// FunÃ§Ã£o para aplicar filtro
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
            // 'all' - manter ordem original
            break;
    }
    
    displayResults(filteredResults);
}

// FunÃ§Ã£o para exibir resultados
function displayResults(results) {
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    if (results.length === 0) {
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    resultsContainer.style.display = 'grid';
    resultsContainer.innerHTML = '';
    
    // Criar cards
    results.forEach((peneira, index) => {
        const resultCard = createResultCard(peneira);
        resultsContainer.appendChild(resultCard);
        
        // AnimaÃ§Ã£o escalonada
        setTimeout(() => {
            resultCard.classList.add('animate-fade-in-up');
        }, index * 100);
    });
}

// FUNÃ‡ÃƒO MODIFICADA PARA CRIAR CARD DE RESULTADO - COM BOTÃƒO "QUERO PARTICIPAR"
function createResultCard(peneira) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const dataFormatada = formatDate(peneira.data);
    const prazoFormatado = formatDate(peneira.prazoInscricao);
    const distanciaTexto = peneira.distancia < 1 ? 
        `${Math.round(peneira.distancia * 1000)}m` : 
        `${peneira.distancia}km`;
    
    // Determinar status e informaÃ§Ãµes de vagas de forma mais elegante
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
                    <span>${dataFormatada} Ã s ${peneira.horario}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${peneira.endereco || 'EndereÃ§o serÃ¡ definido apÃ³s busca'}</span>
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
    
    // Adicionar classe de status ao card
    card.classList.add(`card-${peneira.status}`);
    
    return card;
}

// FunÃ§Ã£o refinada para obter informaÃ§Ãµes de status
function getStatusInfo(peneira) {
    if (peneira.status === 'encerrada') {
        return {
            badge: '<span class="status-badge status-closed">Encerrada</span>',
            banner: '<div class="status-banner closed"><i class="fas fa-times-circle"></i><span>InscriÃ§Ãµes Encerradas</span></div>'
        };
    }
    
    // Para peneiras abertas, mostrar badge de disponibilidade baseado nas vagas
    let availabilityBadge = '';
    if (peneira.vagasDisponiveis <= 10) {
        availabilityBadge = '<span class="status-badge status-urgent">Ãšltimas Vagas</span>';
    } else if (peneira.vagasDisponiveis <= 20) {
        availabilityBadge = '<span class="status-badge status-limited">Vagas Limitadas</span>';
    } else {
        availabilityBadge = '<span class="status-badge status-open">DisponÃ­vel</span>';
    }
    
    return {
        badge: availabilityBadge,
        banner: ''
    };
}

// FunÃ§Ã£o refinada para obter informaÃ§Ãµes de vagas
function getVagasInfo(peneira) {
    if (peneira.status !== 'aberta') {
        return { html: '' };
    }
    
    const percentualOcupado = ((peneira.totalVagas - peneira.vagasDisponiveis) / peneira.totalVagas) * 100;
    
    return {
        html: `
            <div class="availability-section">
                <div class="availability-header">
                    <span class="availability-label">Disponibilidade</span>
                    <span class="availability-count">${peneira.vagasDisponiveis} de ${peneira.totalVagas} vagas</span>
                </div>
                <div class="availability-bar">
                    <div class="availability-progress" style="width: ${percentualOcupado}%"></div>
                </div>
            </div>
        `
    };
}

// FunÃ§Ã£o refinada para obter informaÃ§Ãµes de prazo
function getPrazoInfo(peneira) {
    if (peneira.status !== 'aberta') {
        return { html: '' };
    }
    
    const diasRestantes = getDiasRestantes(peneira.prazoInscricao);
    const prazoFormatado = formatDate(peneira.prazoInscricao);
    
    return {
        html: `
            <div class="deadline-section">
                <div class="deadline-info">
                    <i class="fas fa-clock"></i>
                    <div class="deadline-text">
                        <span class="deadline-label">Prazo de inscriÃ§Ã£o</span>
                        <span class="deadline-date">${prazoFormatado}</span>
                        <span class="deadline-remaining">${diasRestantes}</span>
                    </div>
                </div>
            </div>
        `
    };
}

// FunÃ§Ã£o para calcular dias restantes
function getDiasRestantes() {
    const hoje = new Date();
    const prazo = new Date();
    const diffTime = prazo - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return 'Ãšltimas Vagas';
    } else if (diffDays === 0) {
        return 'Ãšltimas Vagas!';
    } else if (diffDays === 1) {
        return 'Ãšltimas Vagas';
    }
}

// FunÃ§Ã£o para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('pt-BR', options);
}

// NOVA FUNÃ‡ÃƒO: Abrir modal com informaÃ§Ãµes da peneira
function openPeneiraModal(peneiraId) {
    const peneira = peneirasData.find(p => p.id === peneiraId);
    if (!peneira) return;
    
    // Preencher informaÃ§Ãµes do modal
    document.getElementById('modal-title').textContent = peneira.titulo;
    document.getElementById('modal-clube').textContent = peneira.clube;
    document.getElementById('modal-data-horario').textContent = `${formatDate(peneira.data)} Ã s ${peneira.horario}`;
    document.getElementById('modal-endereco').textContent = peneira.endereco || 'EndereÃ§o serÃ¡ definido apÃ³s busca';
    document.getElementById('modal-categoria').textContent = peneira.categoria;
    document.getElementById('modal-requisitos').textContent = peneira.requisitos;
    document.getElementById('modal-contato').textContent = peneira.contato;
    document.getElementById('modal-prazo').textContent = formatDate(peneira.prazoInscricao);
    
    // InformaÃ§Ãµes de vagas (apenas para peneiras abertas)
    if (peneira.status === 'aberta') {
        const percentualOcupado = ((peneira.totalVagas - peneira.vagasDisponiveis) / peneira.totalVagas) * 100;
        document.getElementById('modal-vagas').textContent = `${peneira.vagasDisponiveis} vagas disponÃ­veis de ${peneira.totalVagas} total`;
        document.getElementById('modal-availability-progress').style.width = `${percentualOcupado}%`;
        document.getElementById('modal-vagas-info').style.display = 'block';
    } else {
        document.getElementById('modal-vagas-info').style.display = 'none';
    }
    
    // Mostrar modal
    const modal = document.getElementById('peneira-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Fechar modal ao clicar fora dele
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePeneiraModal();
        }
    });
}

// NOVA FUNÃ‡ÃƒO: Fechar modal
function closePeneiraModal() {
    const modal = document.getElementById('peneira-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listener para fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePeneiraModal();
    }
});

// FunÃ§Ã£o para mostrar loading
function showLoading(isCepSearch = false) {
    if (!isCepSearch) {
        loadingAddress.textContent = 'Buscando peneiras...';
    }
    loadingOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// FunÃ§Ã£o para esconder loading
function hideLoading() {
    loadingOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// FunÃ§Ã£o para mostrar notificaÃ§Ãµes
function showNotification(message, type = 'info') {
    // Remover notificaÃ§Ã£o existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notification-container');
    container.appendChild(notification);
    
    // Remover notificaÃ§Ã£o apÃ³s 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// FunÃ§Ã£o para configurar animaÃ§Ãµes de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.step-card, .feature-card, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));
}
