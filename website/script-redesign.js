// Fetch extension stats from OpenVSX
async function fetchExtensionStats() {
    try {
        const response = await fetch('https://open-vsx.org/api/PascalX/SketchPrompt');
        const data = await response.json();
        
        // Update download count
        const downloadCount = data.downloadCount || 419;
        const formattedCount = downloadCount.toLocaleString();
        const countElement = document.getElementById('download-count');
        if (countElement) {
            countElement.textContent = formattedCount;
        }
        
        // Update version
        const version = data.version || '0.2.4';
        const versionElement = document.getElementById('version-number');
        if (versionElement) {
            versionElement.textContent = version;
        }
        
        // Update rating (convert to stars)
        const rating = data.averageRating || 5;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        const emptyStars = 5 - Math.ceil(rating);
        stars += '☆'.repeat(emptyStars);
        
        const ratingElement = document.getElementById('rating-stars');
        if (ratingElement) {
            ratingElement.textContent = stars;
            ratingElement.title = `${rating.toFixed(1)} out of 5`;
        }
        
        // Update last update date
        const timestamp = data.timestamp || data.publishedDate;
        if (timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            let timeAgo;
            if (diffDays === 0) {
                timeAgo = 'today';
            } else if (diffDays === 1) {
                timeAgo = '1d ago';
            } else if (diffDays < 30) {
                timeAgo = `${diffDays}d ago`;
            } else if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                timeAgo = `${months}mo ago`;
            } else {
                const years = Math.floor(diffDays / 365);
                timeAgo = `${years}y ago`;
            }
            
            const updateElement = document.getElementById('last-update');
            if (updateElement) {
                updateElement.textContent = timeAgo;
                updateElement.title = date.toLocaleDateString();
            }
        }
        
    } catch (error) {
        console.log('Could not fetch extension stats:', error);
        // Set fallback values
        const countElement = document.getElementById('download-count');
        if (countElement) countElement.textContent = '419';
        
        const updateElement = document.getElementById('last-update');
        if (updateElement) updateElement.textContent = 'recently';
    }
}

// Sticky nav scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Editor installation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Fetch extension stats on page load
    fetchExtensionStats();
    
    const installButtons = document.querySelectorAll('.hero-install-btn');
    
    installButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleInstallClick();
        });
    });
    
    function handleInstallClick() {
        // Check if device is mobile/tablet
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                              (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
        
        if (isMobileDevice) {
            // On mobile devices, scroll to installation section instead of showing modal
            const installationSection = document.querySelector('#install');
            if (installationSection) {
                installationSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            showEditorSelectionModal();
        }
    }
    
    function showEditorSelectionModal() {
        const modal = document.createElement('div');
        modal.className = 'editor-selection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Choose your code editor</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <p class="modal-description">SketchPrompt is an extension that works with many code editors. Select your editor to install SketchPrompt directly.</p>
                <div class="modal-editor-options">
                    <div class="modal-editor-option" data-editor="cursor">
                        <div class="modal-editor-info">
                            <img src="https://cursor.sh/favicon.ico" alt="Cursor" class="modal-editor-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgMTBIMjJMMTQgMTJMMTYgMjJMMTIgMThMMTAgMjJMMTIgMTJMMiAxMEwxMiAyWiIgZmlsbD0iIzMzMyIvPgo8L3N2Zz4K'">
                            <span class="modal-editor-name">Cursor</span>
                        </div>
                        <button class="modal-install-btn" data-editor="cursor" data-umami-event="modal-install-cursor">Install</button>
                    </div>
                    <div class="modal-editor-option" data-editor="windsurf">
                        <div class="modal-editor-info">
                            <img src="https://windsurf.com/favicon.ico" alt="Windsurf" class="modal-editor-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgMTBIMjJMMTQgMTJMMTYgMjJMMTIgMThMMTAgMjJMMTIgMTJMMiAxMEwxMiAyWiIgZmlsbD0iIzMzMyIvPgo8L3N2Zz4K'">
                            <span class="modal-editor-name">Windsurf</span>
                        </div>
                        <button class="modal-install-btn" data-editor="windsurf" data-umami-event="modal-install-windsurf">Install</button>
                    </div>
                    <div class="modal-editor-option" data-editor="firebase-studio">
                        <div class="modal-editor-info">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROklQN6uy2soSSqi6okf-w-yyymRbETduSeA&s" alt="Google Firebase Studio" class="modal-editor-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgMTBIMjJMMTQgMTJMMTYgMjJMMTIgMThMMTAgMjJMMTIgMTJMMiAxMEwxMiAyWiIgZmlsbD0iIzMzMyIvPgo8L3N2Zz4K'">
                            <span class="modal-editor-name">Firebase Studio</span>
                        </div>
                        <button class="modal-install-btn" data-umami-event="modal-firebase-studio-visit" onclick="window.open('https://firebase.studio', '_blank', 'noopener,noreferrer'); this.closest('.editor-selection-modal').remove();">Visit</button>
                    </div>
                </div>
                <div class="modal-note">
                    <p><strong>Note:</strong> If your editor isn't listed, you can still install SketchPrompt from your editor's extension marketplace by searching for "SketchPrompt".</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Track modal opening
        if (window.umami) {
            window.umami.track('modal-editor-selection-opened');
        }
        
        // Add event listeners to modal install buttons
        const modalInstallButtons = modal.querySelectorAll('.modal-install-btn[data-editor]');
        modalInstallButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const editor = this.getAttribute('data-editor');
                
                // Track install attempt
                if (window.umami) {
                    window.umami.track('modal-install-attempted', { editor: editor });
                }
                
                modal.remove();
                installExtension(editor);
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                // Track modal closed by clicking outside
                if (window.umami) {
                    window.umami.track('modal-editor-selection-closed', { method: 'click-outside' });
                }
                modal.remove();
            }
        });
        
        // Track modal close button click
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                // Track modal closed by close button
                if (window.umami) {
                    window.umami.track('modal-editor-selection-closed', { method: 'close-button' });
                }
                modal.remove();
            });
        }
    }
    
    function installExtension(editor) {
        const extensionId = 'PascalX.SketchPrompt';
        
        // Define editor-specific installation URLs
        const editorUrls = {
            'cursor': `cursor:extension/${extensionId}`,
            'windsurf': `windsurf:extension/${extensionId}`,
            'firebase-studio': null // Firebase Studio is web-based, no extension installation
        };
        
        const url = editorUrls[editor];
        if (url) {
            // Try to open the editor-specific URL
            window.location.href = url;
            
            // Fallback: Show a message if the editor isn't installed
            setTimeout(() => {
                // If we're still on the same page after 2 seconds, show fallback
                if (document.visibilityState === 'visible') {
                    showEditorFallback(editor);
                }
            }, 2000);
        }
    }
    
    function showEditorFallback(editor) {
        const editorNames = {
            'cursor': 'Cursor IDE',
            'windsurf': 'Windsurf',
            'firebase-studio': 'Google Firebase Studio'
        };
        
        const editorUrls = {
            'cursor': 'https://cursor.sh',
            'windsurf': 'https://windsurf.com',
            'firebase-studio': 'https://firebase.studio'
        };
        
        const editorName = editorNames[editor] || editor;
        const editorUrl = editorUrls[editor] || '#';
        
        // Create a modal notification
        const fallback = document.createElement('div');
        fallback.className = 'editor-selection-modal';
        fallback.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${editorName} not detected</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <p class="modal-description">It looks like ${editorName} isn't installed or running on your system.</p>
                <div class="fallback-actions">
                    <a href="${editorUrl}" target="_blank" rel="noopener noreferrer" class="fallback-btn fallback-btn-primary">${editor === 'firebase-studio' ? 'Visit' : 'Download'} ${editorName}</a>
                    <button class="modal-close fallback-btn fallback-btn-secondary">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(fallback);
        
        // Close button functionality
        fallback.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => fallback.remove());
        });
        
        // Click outside to close
        fallback.addEventListener('click', (e) => {
            if (e.target === fallback) fallback.remove();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (fallback.parentElement) {
                fallback.remove();
            }
        }, 10000);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Simple scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature, .use-case, .step, .security-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

