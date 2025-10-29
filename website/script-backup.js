

// Hero value propositions for cycling animation
const heroValueProps = [
  'Sketch your ideas',
  'Diagram your thinking',
  'Visualize the next step',
  'Design your prompt visually',
  'Externalize your thinking',
  'Think in spatial patterns',
  'Combine visuals and language',
  'Bring clarity to complexity',
  'Structure your thought process',
  'Bring shape to your solution'
];

// Research-backed facts with footnotes
const researchFacts = [
    {
        text: 'Pictures beat words for memory. After three days, people recall <em>65%</em> of what they saw in images versus only <em>10%</em> of text—the classic <em>picture-superiority effect</em>.',
        sources: [1, 2]
    },
    {
        text: 'Brains run on dual coding. We store information in two channels—verbal <em>and</em> visual—so combining sketch + text roughly <strong>doubles recall potential</strong> (Paivio\'s Dual-Coding Theory).',
        sources: [3, 4]
    },
    {
        text: 'Visual note-taking locks in learning. Studies at Princeton/UCLA show students who doodle concepts outperform typists on conceptual recall, thanks to deeper processing.',
        sources: [5]
    },
    {
        text: 'Most of us are visual learners. Roughly <strong>65% of the population</strong> process new information fastest through visuals, making sketches the default language for two-thirds of users.',
        sources: [6]
    },
    {
        text: 'Sketching turbo-charges idea generation. Experimental "brain-sketching" sessions spark <em>more</em> and <em>better</em> concepts than talking alone by triggering reinterpretation loops.',
        sources: [7, 8]
    },
    {
        text: 'Low-fidelity sketches invite brutal honesty. Users feel less pressure and give richer feedback when they see quick hand drawings versus polished comps.',
        sources: [9]
    },
    {
        text: 'Paper prototypes cut dev time. Low-fi sketches let teams validate flows "in minutes, not days," speeding testing velocity and focusing feedback on essentials.',
        sources: [10, 11]
    },
    {
        text: 'Engineers who sketch debug faster. Drawing systems on a whiteboard improves problem-solving and creativity for software teams.',
        sources: [12]
    },
    {
        text: 'Sketching clarifies complex data. Data-viz designers report sketch first to explore, choose and communicate stories before touching code.',
        sources: [13]
    },
    {
        text: 'AI-assisted sketching is already boosting ideation. Early research on human–AI "co-creative" sketch partners shows higher concept breadth and depth in design sessions.',
        sources: [14]
    }
];

// Source URLs for footnotes
const sourceUrls = {
    1: { url: 'https://www.nngroup.com/articles/picture-superiority-effect/?utm_source=chatgpt.com', title: 'The Picture-Superiority Effect: Harness the Power of Visuals - NN/g' },
    2: { url: 'https://en.wikipedia.org/wiki/Picture_superiority_effect?utm_source=chatgpt.com', title: 'Picture superiority effect - Wikipedia' },
    3: { url: 'https://plato.stanford.edu/archIves/sum2020/entries/mental-imagery/theories-memory.html?utm_source=chatgpt.com', title: 'Dual Coding and Common Coding Theories of Memory' },
    4: { url: 'https://en.wikipedia.org/wiki/Dual-coding_theory?utm_source=chatgpt.com', title: 'Dual-coding theory - Wikipedia' },
    5: { url: 'https://inkfactorystudio.com/blog/powerful-science-behind-visual-notetaking/?utm_source=chatgpt.com', title: 'The Powerful Science Behind Visual Note-Taking - Ink Factory Studio' },
    6: { url: 'https://www.shiftelearning.com/blog/bid/350326/studies-confirm-the-power-of-visuals-in-elearning?utm_source=chatgpt.com', title: 'Studies Confirm the Power of Visuals to Engage Your Audience in ...' },
    7: { url: 'https://www.sciencedirect.com/science/article/abs/pii/S0142694X22000795?utm_source=chatgpt.com', title: 'Sketching and context: Exploring creativity in idea generation groups' },
    8: { url: 'https://www.researchgate.net/publication/221629367_Functions_of_sketching_in_design_idea_generation_meetings?utm_source=chatgpt.com', title: '(PDF) Functions of sketching in design idea generation meetings' },
    9: { url: 'https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/?utm_source=chatgpt.com', title: 'UX Prototypes: Low Fidelity vs. High Fidelity - NN/g' },
    10: { url: 'https://www.interaction-design.org/literature/article/prototyping-learn-eight-common-methods-and-best-practices?srsltid=AfmBOooo_LsNjMOV4KQabqGfox8p2KdBvRwzF2ZjRCmUwZk6meIMMtcH&utm_source=chatgpt.com', title: '5 Common Low-Fidelity Prototypes and Their Best Practices | IxDF' },
    11: { url: 'https://thegood.com/insights/what-is-prototyping/?utm_source=chatgpt.com', title: 'What Is Prototyping And Why Is Mid Fidelity Its Unsung Hero In ...' },
    12: { url: 'https://nicolas.brousse.info/blog/creativity-and-resourcefulness/?utm_source=chatgpt.com', title: 'Why Every Software Engineer Should Learn How to Draw' },
    13: { url: 'https://medium.com/%40tjanmichela/the-importance-of-sketching-in-data-visualization-78320c62e403?utm_source=chatgpt.com', title: 'The Importance of Sketching in Data Visualization | by Michela Tjan' },
    14: { url: 'https://graduateschool.charlotte.edu/cognitive-study-design-ideation-ai-based-co-creative-sketching-partner?utm_source=chatgpt.com', title: 'THE COGNITIVE STUDY OF DESIGN IDEATION IN AN AI-BASED ...' }
};

// Variables for fact cycling
let currentFactIndex = 0;
let funFactElement = null;
let indicatorDots = null;
let factInterval = null;

// Hero cycling animation variables
let currentHeroIndex = 0;
let heroElement = null;
let heroInterval = null;

function createFootnoteSup(sourceNum) {
    const sup = document.createElement('sup');
    sup.className = 'footnote-link';
    sup.setAttribute('tabindex', '0');
    sup.setAttribute('role', 'button');
    sup.setAttribute('aria-label', sourceUrls[sourceNum]?.title || `Source ${sourceNum}`);
    sup.textContent = sourceNum;
    sup.addEventListener('click', handleFootnoteClick);
    sup.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFootnoteClick.call(this, e);
        }
    });
    return sup;
}

function cycleFunFact() {
    if (!funFactElement || !indicatorDots || indicatorDots.length === 0) {
        initializeFactCycling();
        return;
    }
    funFactElement.style.opacity = '0';
    indicatorDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentFactIndex);
    });
    setTimeout(() => {
        currentFactIndex = (currentFactIndex + 1) % researchFacts.length;
        const fact = researchFacts[currentFactIndex];
        funFactElement.innerHTML = '';
        funFactElement.appendChild(document.createTextNode(fact.text.replace(/<[^>]+>/g, '')));
        // Add footnotes
        fact.sources.forEach(sourceNum => {
            funFactElement.appendChild(createFootnoteSup(sourceNum));
        });
        funFactElement.style.opacity = '1';
    }, 300);
}

function initializeFactCycling() {
    funFactElement = document.querySelector('.fun-fact-text');
    indicatorDots = document.querySelectorAll('.indicator-dot');
    if (funFactElement && indicatorDots.length > 0) {
        currentFactIndex = 0;
        const initialFact = researchFacts[0];
        funFactElement.innerHTML = '';
        funFactElement.appendChild(document.createTextNode(initialFact.text.replace(/<[^>]+>/g, '')));
        initialFact.sources.forEach(sourceNum => {
            funFactElement.appendChild(createFootnoteSup(sourceNum));
        });
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentFactIndex);
        });
        if (factInterval) clearInterval(factInterval);
        factInterval = setInterval(cycleFunFact, 5000);
    } else {
        setTimeout(initializeFactCycling, 1000);
    }
}

function handleFootnoteClick(e) {
    e.preventDefault();
    const sourceNum = this.getAttribute('data-sources') || this.textContent;
    const source = sourceUrls[sourceNum];
    if (source) {
        window.open(source.url, '_blank', 'noopener,noreferrer');
    }
}

function cycleHeroValueProp() {
    if (!heroElement) {
        initializeHeroCycling();
        return;
    }
    
    // Fade out
    heroElement.classList.add('fade-out');
    
    setTimeout(() => {
        // Update text
        currentHeroIndex = (currentHeroIndex + 1) % heroValueProps.length;
        heroElement.textContent = heroValueProps[currentHeroIndex];
        
        // Fade in
        heroElement.classList.remove('fade-out');
    }, 400);
}

function initializeHeroCycling() {
    heroElement = document.querySelector('.cycling-value-prop');
    if (heroElement) {
        currentHeroIndex = 0;
        heroElement.textContent = heroValueProps[0];
        
        if (heroInterval) clearInterval(heroInterval);
        // Start cycling after a short delay to make it more obvious
        setTimeout(() => {
            heroInterval = setInterval(cycleHeroValueProp,4000); // Change every 4 seconds
        }, 1000); // Start after 1 second
    } else {
        setTimeout(initializeHeroCycling, 1000);
    }
}

// Pause/resume cycling on hover/focus
let cyclingPaused = false;
function pauseCycling() {
    if (!cyclingPaused) {
        clearInterval(factInterval);
        cyclingPaused = true;
    }
}
function resumeCycling() {
    if (cyclingPaused) {
        factInterval = setInterval(cycleFunFact, 5000);
        cyclingPaused = false;
    }
}

// Pause/resume hero cycling on hover/focus
let heroCyclingPaused = false;
function pauseHeroCycling() {
    if (!heroCyclingPaused) {
        clearInterval(heroInterval);
        heroCyclingPaused = true;
    }
}
function resumeHeroCycling() {
    if (heroCyclingPaused) {
        heroInterval = setInterval(cycleHeroValueProp, 4500);
        heroCyclingPaused = false;
    }
}

// Global click handler for footnotes (fallback)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('footnote-link')) {
        handleFootnoteClick.call(e.target, e);
    }
});

// Existing JS (tabs, split button, nav, smooth scroll, etc.)
document.addEventListener('DOMContentLoaded', function() {
    initializeFactCycling();
    initializeHeroCycling();
    
    // Pause on hover/focus for fun facts
    const funFactCard = document.querySelector('.why-card.fun-fact');
    if (funFactCard) {
        funFactCard.addEventListener('mouseenter', pauseCycling);
        funFactCard.addEventListener('mouseleave', resumeCycling);
        funFactCard.addEventListener('focusin', pauseCycling);
        funFactCard.addEventListener('focusout', resumeCycling);
    }
    
    // Pause on hover/focus for hero cycling
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', pauseHeroCycling);
        heroTitle.addEventListener('mouseleave', resumeHeroCycling);
        heroTitle.addEventListener('focusin', pauseHeroCycling);
        heroTitle.addEventListener('focusout', resumeHeroCycling);
    }

  // Split button dropdown
  const splitBtnToggle = document.querySelector('.split-btn-toggle');
  const splitBtnDropdown = document.querySelector('.split-btn-dropdown');
  if (splitBtnToggle && splitBtnDropdown) {
    splitBtnToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      splitBtnDropdown.classList.toggle('open');
    });
    document.addEventListener('click', function() {
      splitBtnDropdown.classList.remove('open');
    });
  }

  // Tab functionality for installation section
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      const tabContainer = this.closest('.installation-tabs, .section-tabs');
      
      // Remove active class from all buttons and panes in this container
      tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      tabContainer.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and target pane
      this.classList.add('active');
      const targetPane = tabContainer.querySelector(`#${targetTab}-tab`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
      
      // Reinitialize fact cycling if "Why" tab is shown
      if (targetTab === 'why') {
        setTimeout(initializeFactCycling, 100);
      }
    });
  });

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Special handling for Demo nav link - open demos tab
        if (this.getAttribute('href') === '#usage' && this.textContent.trim().includes('Demo')) {
          setTimeout(() => {
            // Find the demos tab button and click it
            const demosTab = document.querySelector('[data-tab="demos"]');
            if (demosTab) {
              // Manually trigger the tab switching logic
              const tabContainer = demosTab.closest('.section-tabs');
              if (tabContainer) {
                // Remove active class from all buttons and panes
                tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                tabContainer.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                
                // Add active class to demos button and pane
                demosTab.classList.add('active');
                const demosPane = document.querySelector('#demos-tab');
                if (demosPane) {
                  demosPane.classList.add('active');
                }
              }
            }
          }, 500); // Reduced delay for better responsiveness
        }
      }
    });
  });
  
  // Prevent smooth scrolling from interfering with mobile menu
  document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-toggle')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});



// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Copy code blocks functionality
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(code => {
        code.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show a temporary "Copied!" message
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.background = '#10b981';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
        
        // Add cursor pointer to code blocks
        code.style.cursor = 'pointer';
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
});



// Add active state to navigation links based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Editor installation functionality
document.addEventListener('DOMContentLoaded', function() {
    const installButtons = document.querySelectorAll('.install-btn');
    const heroInstallBtn = document.querySelector('.hero-install-btn');
    const navInstallBtn = document.querySelector('.nav-install-btn');
    const ctaInstallBtn = document.querySelector('.cta-install-btn');
    
    // Handle hero button click
    if (heroInstallBtn) {
        heroInstallBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleInstallClick();
        });
    }
    
    // Handle navigation button click
    if (navInstallBtn) {
        navInstallBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleInstallClick();
        });
    }
    
    // Handle CTA button click
    if (ctaInstallBtn) {
        ctaInstallBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleInstallClick();
        });
    }
    
    function handleInstallClick() {
        // Check if device is mobile/tablet
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                              (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
        
        if (isMobileDevice) {
            // On mobile devices, scroll to installation section instead of showing modal
            const installationSection = document.querySelector('#installation');
            if (installationSection) {
                installationSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            showEditorSelectionModal();
        }
    }
    
    installButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const editor = this.getAttribute('data-editor');
            installExtension(editor);
        });
    });
    
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
                        <button class="btn btn-secondary modal-install-btn" data-editor="cursor" data-umami-event="modal-install-cursor">Install</button>
                    </div>
                    <div class="modal-editor-option" data-editor="windsurf">
                        <div class="modal-editor-info">
                            <img src="https://windsurf.com/favicon.ico" alt="Windsurf" class="modal-editor-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgMTBIMjJMMTQgMTJMMTYgMjJMMTIgMThMMTAgMjJMMTIgMTJMMiAxMEwxMiAyWiIgZmlsbD0iIzMzMyIvPgo8L3N2Zz4K'">
                            <span class="modal-editor-name">Windsurf</span>
                        </div>
                        <button class="btn btn-secondary modal-install-btn" data-editor="windsurf" data-umami-event="modal-install-windsurf">Install</button>
                    </div>
                    <div class="modal-editor-option" data-editor="firebase-studio">
                        <div class="modal-editor-info">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROklQN6uy2soSSqi6okf-w-yyymRbETduSeA&s" alt="Google Firebase Studio" class="modal-editor-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgMTBIMjJMMTQgMTJMMTYgMjJMMTIgMThMMTAgMjJMMTIgMTJMMiAxMEwxMiAyWiIgZmlsbD0iIzMzMyIvPgo8L3N2Zz4K'">
                            <span class="modal-editor-name">Firebase Studio</span>
                        </div>
                        <button class="btn btn-secondary modal-visit-btn" data-umami-event="modal-firebase-studio-visit" onclick="window.open('https://firebase.studio', '_blank', 'noopener,noreferrer')">Install</button>
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
        const modalInstallButtons = modal.querySelectorAll('.modal-install-btn');
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
        
        // Handle Firebase Studio visit button (not an install action)
        const modalVisitBtn = modal.querySelector('.modal-visit-btn');
        if (modalVisitBtn) {
            modalVisitBtn.addEventListener('click', function(e) {
                // Track Firebase Studio visit
                if (window.umami) {
                    window.umami.track('modal-firebase-studio-visit');
                }
                // Close modal after tracking
                modal.remove();
            });
        }
        
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
        
        const editorName = editorNames[editor] || editor;
        
        // Create a modal or notification
        const fallback = document.createElement('div');
        fallback.className = 'editor-fallback';
        fallback.innerHTML = `
            <div class="fallback-content">
                <h3>${editorName} not detected</h3>
                <p>It looks like ${editorName} isn't installed or running on your system.</p>
                <div class="fallback-actions">
                    <a href="https://${editor === 'cursor' ? 'cursor.sh' : editor === 'windsurf' ? 'windsurf.com' : 'firebase.studio'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">${editor === 'firebase-studio' ? 'Visit' : 'Download'} ${editorName}</a>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(fallback);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (fallback.parentElement) {
                fallback.remove();
            }
        }, 10000);
    }
});