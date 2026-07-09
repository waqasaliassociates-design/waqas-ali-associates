/**
 * Waqas Ali Associates (WAA) - Premium Architecture Vanilla JS Controller
 * Handles sticky navs, filters, validation, accordions, dynamic detail pages, and lightboxes.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Always initialize Lucide icons first
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  /* ==========================================================================
     1. Scroll Progress & Sticky Navigation
     ========================================================================== */
  const header = document.getElementById("main-header");
  const scrollProgress = document.getElementById("scroll-progress");
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate progress percentage
    if (docHeight > 0 && scrollProgress) {
      const scrolled = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Header stickiness transition
    if (header) {
      if (scrollTop > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
      if (scrollTop > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }
  });

  // Scroll to top button click behavior
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Hero Scroll to About link
  const scrollToAboutBtn = document.getElementById("scroll-to-about");
  const aboutSection = document.getElementById("about-preview");
  if (scrollToAboutBtn && aboutSection) {
    scrollToAboutBtn.addEventListener("click", () => {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ==========================================================================
     2. Mobile Hamburger Menu Drawer Toggles
     ========================================================================== */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      menuToggle.classList.toggle("open");
      
      // Update ARIA expand label for accessibility
      menuToggle.setAttribute("aria-expanded", isOpen);
      
      // Prevent body scrolling when menu is open
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close mobile nav drawer when clicking on links
    const mobileLinks = mobileNav.querySelectorAll(".mobile-nav-link");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuToggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ==========================================================================
     3. Project Filters (Vanilla JS for projects.html)
     ========================================================================== */
  const filterContainer = document.getElementById("project-filters");
  const portfolioGrid = document.getElementById("portfolio-grid");

  if (filterContainer && portfolioGrid) {
    const filterButtons = filterContainer.querySelectorAll(".filter-btn");
    const portfolioItems = portfolioGrid.querySelectorAll(".portfolio-item-card");

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Remove active class from other buttons and assign to current
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        portfolioItems.forEach(item => {
          const category = item.getAttribute("data-category");
          
          if (filterValue === "all" || category === filterValue) {
            item.classList.remove("hide");
            // Simple micro-animation triggers
            item.style.opacity = "0";
            item.style.transform = "scale(0.95)";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
              item.style.transition = "var(--transition-smooth)";
            }, 30);
          } else {
            item.classList.add("hide");
          }
        });
      });
    });
  }

  /* ==========================================================================
     4. Accordion Component (Vanilla JS for FAQ on contact.html)
     ========================================================================== */
  const faqAccordion = document.getElementById("faq-accordion");

  if (faqAccordion) {
    const accordionItems = faqAccordion.querySelectorAll(".faq-accordion-item");

    accordionItems.forEach(item => {
      const trigger = item.querySelector(".faq-trigger");
      const panel = item.querySelector(".faq-panel");

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        // Close other items for single-open behavior (accordion style)
        accordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("open");
            otherItem.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
            otherItem.querySelector(".faq-panel").style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
          // Calculate precise content height dynamically
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ==========================================================================
     5. Contact Form Validation (Vanilla JS for contact.html)
     ========================================================================== */
  const contactForm = document.getElementById("waa-contact-form");
  const formStatus = document.getElementById("form-status-message");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Get fields
      const nameField = document.getElementById("contact-name");
      const emailField = document.getElementById("contact-email");
      const phoneField = document.getElementById("contact-phone");
      const projectTypeField = document.getElementById("contact-project-type");
      const messageField = document.getElementById("contact-message");

      let isValid = true;

      // 1. Validate Name
      if (!nameField.value.trim()) {
        nameField.closest(".form-group").classList.add("invalid");
        isValid = false;
      } else {
        nameField.closest(".form-group").classList.remove("invalid");
      }

      // 2. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
        emailField.closest(".form-group").classList.add("invalid");
        isValid = false;
      } else {
        emailField.closest(".form-group").classList.remove("invalid");
      }

      // 3. Validate Phone (Very simple length check for global coordinates)
      if (!phoneField.value.trim() || phoneField.value.trim().length < 7) {
        phoneField.closest(".form-group").classList.add("invalid");
        isValid = false;
      } else {
        phoneField.closest(".form-group").classList.remove("invalid");
      }

      // 4. Validate Project Typology
      if (!projectTypeField.value) {
        projectTypeField.closest(".form-group").classList.add("invalid");
        isValid = false;
      } else {
        projectTypeField.closest(".form-group").classList.remove("invalid");
      }

      // 5. Validate Message
      if (!messageField.value.trim() || messageField.value.trim().length < 15) {
        messageField.closest(".form-group").classList.add("invalid");
        isValid = false;
      } else {
        messageField.closest(".form-group").classList.remove("invalid");
      }

      // Handle Final Validation Results
      if (formStatus) {
        formStatus.style.display = "block";
        if (isValid) {
          formStatus.className = "form-status-box success";
          formStatus.innerHTML = `
            <strong>Submission Successful!</strong> Thank you, ${nameField.value.trim()}. 
            Your architectural request has been cataloged under WAA systems. A principal coordinator will contact you within 24 hours.
          `;
          
          // Clear form fields
          contactForm.reset();
          
          // Smooth scroll to top of status message
          formStatus.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          formStatus.className = "form-status-box error";
          formStatus.innerHTML = `
            <strong>Validation Failed!</strong> Please correct the highlighted errors in red before submitting your request.
          `;
          formStatus.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });

    // Live validation listener for input cleanups on keystroke
    const inputs = contactForm.querySelectorAll(".form-control");
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        const formGroup = input.closest(".form-group");
        if (formGroup && formGroup.classList.contains("invalid")) {
          if (input.value.trim() !== "") {
            formGroup.classList.remove("invalid");
          }
        }
      });
    });
  }

  /* ==========================================================================
     6. Dynamic Portfolio Detail Loader (for project-details.html)
     ========================================================================== */
  // Elegant local project database mapping
  const projectDatabase = {
    obsidian: {
      title: "The Obsidian Villa",
      tagLocation: "MALIBU, USA",
      client: "Sir Alexander Sterling",
      location: "Malibu, California",
      year: "2025",
      area: "8,200 SQFT",
      lead: "Waqas Ali",
      services: "Architecture, Interior, Project Management",
      storyTitle: "Bespoke Cliffside Luxury",
      highlight1Val: "12m",
      highlight1Lbl: "Double-Height Ceilings",
      highlight2Val: "50m",
      highlight2Lbl: "Cliff Bedrock Piling",
      highlight3Val: "A+++",
      highlight3Lbl: "Energy Independence",
      storyHtml: `
        <p class="section-paragraph">The Obsidian Villa is a premier masterwork of modern residential architecture. Designed for private banking magnate Sir Alexander Sterling, the structure sits dramatically cantilevered over a sheer coastal cliff edge in Malibu, California.</p>
        <p class="section-paragraph">Our primary engineering objective was to negotiate the steep, geologically unstable terrain without disrupting the native cliffside topology. The structural core utilizes twenty-two reinforced steel-concrete foundation piles drilled fifty meters into basalt bedrock, securing a massive multi-deck architectural framework that floats above the surf.</p>
        <h3 class="story-subheading">The Material Matrix</h3>
        <p class="section-paragraph">Reflecting the client's desire for an "unyielding, elegant presence," the facade is finished in charcoal-tinted concrete matrices, dark brushed titanium grids, and bespoke thermal panels. These materials ensure high resistance to salty ocean air and microclimatic heat grids, minimizing typical long-term coastal erosion.</p>
        <p class="section-paragraph">Inside, the layout unfolds into a majestic open-plan grid, utilizing floating travertine stairwells, custom-forged metal fireplaces, and bespoke walnut cabinetry curated by Sarah Jenkins. Every light fitting, handle, and tile configuration is carefully calculated to deliver flawless visual luxury.</p>
      `,
      bannerUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "The Obsidian Villa landscape view of pool deck and structural columns" },
        { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80", alt: "Minimalist spatial interior design of living area with gold detailing" },
        { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80", alt: "Obsidian Villa coastal pool deck cantilever sunset detail" },
        { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80", alt: "Modern luxury kitchen with high-end marble islands" },
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", alt: "Architectural layout blueprint and material selection perspective" }
      ],
      prev: "elysian",
      next: "aurelia"
    },
    aurelia: {
      title: "Aurelia Plaza",
      tagLocation: "DUBAI, UAE",
      client: "Aurelia Corporate Group",
      location: "Business Bay, Dubai",
      year: "2024",
      area: "145,000 SQFT",
      lead: "Waqas Ali",
      services: "Commercial Architecture, Sustainability Consulting",
      storyTitle: "A Monument of Corporate Innovation",
      highlight1Val: "15",
      highlight1Lbl: "High-Performance Stories",
      highlight2Val: "BIM",
      highlight2Lbl: "Digital Core Engineering",
      highlight3Val: "LEED",
      highlight3Lbl: "Gold Certified Standard",
      storyHtml: `
        <p class="section-paragraph">Aurelia Plaza rises fifteen stories above the Business Bay financial district in Dubai, asserting a new benchmark for sustainable commercial skyscrapers. Commissioned by the Aurelia Corporate Group, this high-rise is designed to act as an integrated wellness corporate office.</p>
        <p class="section-paragraph">Our core architectural solution was to balance Dubai's demanding thermal load parameters with aesthetic transparency. We developed a secondary kinetic facade grid consisting of automated perforated brass sunscreens. These screens adjust dynamically to the movement of the sun, mitigating direct solar heat gain by 40% while preserving panoramic office views.</p>
        <h3 class="story-subheading">Acoustics & Space</h3>
        <p class="section-paragraph">The internal core replaces traditional boxed office sections with fluid, double-height bento-style modules. To facilitate focused productivity, we integrated micro-perforated acoustic timber ceilings, natural cascading water walls, and an indoor rooftop eco-park utilizing greywater-fed microclimates.</p>
      `,
      bannerUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", alt: "Aurelia Plaza skyscraper towering metallic structure" },
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", alt: "Elegant corporate atrium and automated glass elevators" },
        { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80", alt: "Open modular office spatial blueprint layouts" },
        { url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=600&q=80", alt: "Luxury executive boardroom with tailored acoustic details" },
        { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80", alt: "Construction core staging and steel structural reinforcement" }
      ],
      prev: "obsidian",
      next: "vera"
    },
    vera: {
      title: "Vera Eco-Pavilion",
      tagLocation: "MUNICH, GERMANY",
      client: "Vera Hotels & Resorts",
      location: "Munich, Germany",
      year: "2026",
      area: "24,000 SQFT",
      lead: "David Thorne",
      services: "Sustainable Engineering, Architectural Design",
      storyTitle: "Intelligent Climate-Responsive Structure",
      highlight1Val: "Net0",
      highlight1Lbl: "Operational Carbon Metric",
      highlight2Val: "100%",
      highlight2Lbl: "Local Timber Sourcing",
      highlight3Val: "Active",
      highlight3Lbl: "Solar Roof Canopy Grid",
      storyHtml: `
        <p class="section-paragraph">The Vera Eco-Pavilion is an award-winning multi-family residential framework, custom-built to prove that zero-carbon living can coexist with elite architectural grace. Positioned within Munich's eco-district, it acts as a landmark of sustainable luxury.</p>
        <p class="section-paragraph">Our engineering design employs pre-engineered cross-laminated timber (CLT) framing sourced entirely from sustainable Bavarian forests. By utilizing modular wooden columns and interlocking joints, we eliminated standard carbon-intensive cement foundations, establishing a framework that naturally sequestered over five hundred tons of atmospheric carbon during construction.</p>
        <h3 class="story-subheading">Passive Energy Grids</h3>
        <p class="section-paragraph">The building is wrapped in a high-density triple-glazed vacuum envelope, insulated with natural sheep's wool composites. Geothermal heat loops extract ground energy to fuel underfloor radiant grids, while a beautiful rooftop solar canopy generates 120% of the pavilion's daily electricity needs, routing excess power back into the public municipal power lines.</p>
      `,
      bannerUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", alt: "Vera Eco-Pavilion timber and glass exterior structural view" },
        { url: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80", alt: "Eco-luxury lounge with floating timber ceiling details" },
        { url: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=600&q=80", alt: "Munich eco-district sustainable exterior facade perspective" },
        { url: "https://images.unsplash.com/photo-1502005229762-fc1b2381f0bb?auto=format&fit=crop&w=600&q=80", alt: "Contemporary living room with active cross-ventilation duct designs" },
        { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80", alt: "Sustainable structural cross section design sketches" }
      ],
      prev: "aurelia",
      next: "helios"
    },
    helios: {
      title: "Helios Penthouse",
      tagLocation: "LONDON, UK",
      client: "The Helios Trust",
      location: "Mayfair, London",
      year: "2025",
      area: "4,500 SQFT",
      lead: "Sarah Jenkins",
      services: "Interior Architecture, Spatial Design",
      storyTitle: "Floating Light & Custom Joinery",
      highlight1Val: "360°",
      highlight1Lbl: "Panoramic City Views",
      highlight2Val: "M1",
      highlight2Lbl: "Bespoke Walnut Joinery",
      highlight3Val: "OLED",
      highlight3Lbl: "Integrated Micro-Lighting",
      storyHtml: `
        <p class="section-paragraph">Located in London's exclusive Mayfair district, the Helios Penthouse is a luxury double-deck sanctuary designed around the physical behavior of natural daylight. Sarah Jenkins and her interior division converted this high-altitude shell into a masterwork of warm minimalism.</p>
        <p class="section-paragraph">Our structural focus was to eradicate interior walls that block perspective lines. We inserted custom-forged structural bronze pillars to support the massive roof span, replacing standard partitions with multi-functional room dividers crafted from fine fluted white oak and smoked gold panels.</p>
        <h3 class="story-subheading">Light Modeling</h3>
        <p class="section-paragraph">To negotiate London's frequent overcast conditions, we designed dynamic panoramic skylights equipped with computerized polarization filters. These filters shift opacity automatically to reflect ambient light conditions, ensuring the central travertine dining core and floating concrete master fireplace are continually illuminated by soft, glare-free daylight.</p>
      `,
      bannerUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", alt: "Helios Penthouse main duplex spatial living area with glass walls" },
        { url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80", alt: "Mayfair skyline view from structural balcony deck" },
        { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", alt: "Travertine master bathroom suite with gold brushed fittings" },
        { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80", alt: "Helios Penthouse dining room detailing bespoke oak joinery" },
        { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", alt: "Detailed catalog of luxury interior textiles and marble specs" }
      ],
      prev: "vera",
      next: "lumina"
    },
    lumina: {
      title: "Lumina Plaza",
      tagLocation: "PARIS, FRANCE",
      client: "French Ministry of Arts",
      location: "Marais District, Paris",
      year: "2023",
      area: "11,200 SQFT",
      lead: "Waqas Ali",
      services: "Public Architecture, Spatial Consultancy",
      storyTitle: "Sculpted Daylight and Fluid Exhibition Space",
      highlight1Val: "100%",
      highlight1Lbl: "Volumetric Fluidity",
      highlight2Val: "CNC",
      highlight2Lbl: "Precision Stone Cutting",
      highlight3Val: "Acoust",
      highlight3Lbl: "Integrated Micro-Plasters",
      storyHtml: `
        <p class="section-paragraph">Commissioned as a multi-use spatial art gallery in Paris' historic Marais, the Lumina Plaza is a tribute to minimalist design and volumetric purity. WAA designed this museum site to replace a fragmented 19th-century workshop.</p>
        <p class="section-paragraph">To support massive structural art installations, we deployed a self-supporting structural shell using white-tinted architectural self-compacting concrete. By utilizing custom CNC-milled structural molds, the facade possesses zero visible panel seams, creating a monolithic, soft stone sculpture that echoes historic Paris stone blocks.</p>
        <h3 class="story-subheading">Dynamic Ray-Tracing</h3>
        <p class="section-paragraph">A central skylight funnel directs natural sunlight deep into subterranean exhibition chambers. Using advanced daylight ray-tracing, the concrete surfaces are tapered at precise mathematical angles, dispersing daylight uniformly across galleries to protect sensitive art canvases without requiring artificial power blocks.</p>
      `,
      bannerUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", alt: "Lumina Plaza white monolithic concrete facade perspective" },
        { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", alt: "Subterranean art gallery chamber showing tapered concrete beams" },
        { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80", alt: "Polished terrazzo flooring and structural ceiling Funnel" },
        { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80", alt: "Monolithic geometric stairs details in Paris gallery" },
        { url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80", alt: "Digital BIM construction drawings and volumetric models" }
      ],
      prev: "helios",
      next: "elysian"
    },
    elysian: {
      title: "Elysian Retreat",
      tagLocation: "BALI, INDONESIA",
      client: "Elysian Wellness Group",
      location: "Ubud, Bali",
      year: "2026",
      area: "18,500 SQFT",
      lead: "David Thorne",
      services: "Bespoke Resort Design, Geothermal Integration",
      storyTitle: "Bespoke Luxury Integrated with Nature",
      highlight1Val: "100%",
      highlight1Lbl: "Geothermal Powering",
      highlight2Val: "Bamb",
      highlight2Lbl: "Tensile Structural Roof",
      highlight3Val: "H2O",
      highlight3Lbl: "Integrated Micro-Filter",
      storyHtml: `
        <p class="section-paragraph">The Elysian Wellness Retreat sits within a steep tropical valley in Ubud, Bali, acting as a high-end wellness sanctuary designed using 100% locally sourced sustainable materials. Our team mapped the cabins and central spa pavilion directly into the natural forest grades.</p>
        <p class="section-paragraph">Our structural core utilizes pressure-treated structural bamboo grids and local volcanic basalt stone masonry. The central roof structures employ beautiful fluid geometries, mimicking the natural flow of local river rapids while ensuring high tensile resistance against seasonal tropical storms.</p>
        <h3 class="story-subheading">Off-Grid Microclimates</h3>
        <p class="section-paragraph">The retreat operates 100% off-grid. Underfloor cooling is achieved by channeling geothermal river loop air through structural concrete sub-foundations, creating natural microclimate control. Graywater is directed through vertical reed-bed micro-filters, returning purified water back into Ubud's agricultural irrigation networks.</p>
      `,
      bannerUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
      gallery: [
        { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", alt: "Elysian Retreat main pavilion over tropical Ubud river bed" },
        { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80", alt: "Bespoke bamboo suites with integrated private plunge pools" },
        { url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80", alt: "Outdoor open-air volcanic stone bath suites" },
        { url: "https://images.unsplash.com/photo-1545459720-aac273a27791?auto=format&fit=crop&w=600&q=80", alt: "Elysian geothermal eco spa reception design details" },
        { url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80", alt: "Traditional hand-drawn layout maps and timber joinery models" }
      ],
      prev: "lumina",
      next: "obsidian"
    }
  };

  // Check if we are on the project-details.html page
  const detailTitle = document.getElementById("detail-title");
  
  if (detailTitle) {
    // 1. Parse URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    let projectId = urlParams.get("id");
    
    // Default to obsidian if ID parameter is invalid or empty
    if (!projectId || !projectDatabase[projectId]) {
      projectId = "obsidian";
    }

    const project = projectDatabase[projectId];

    // 2. Populate DOM Nodes with Dynamic Content
    // Page Header / Breadcrumbs
    detailTitle.textContent = project.title;
    const detailBreadcrumb = document.getElementById("detail-breadcrumb-current");
    const tagLocation = document.getElementById("detail-tag-location");
    const headerBg = document.getElementById("detail-header-bg");

    if (detailBreadcrumb) detailBreadcrumb.textContent = project.title;
    if (tagLocation) tagLocation.textContent = project.tagLocation;
    if (headerBg) {
      headerBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${project.bannerUrl}')`;
    }

    // Specifications Box
    const specClient = document.getElementById("spec-client");
    const specLocation = document.getElementById("spec-location");
    const specYear = document.getElementById("spec-year");
    const specArea = document.getElementById("spec-area");
    const specLead = document.getElementById("spec-lead");
    const specServices = document.getElementById("spec-services");

    if (specClient) specClient.textContent = project.client;
    if (specLocation) specLocation.textContent = project.location;
    if (specYear) specYear.textContent = project.year;
    if (specArea) specArea.textContent = project.area;
    if (specLead) specLead.textContent = project.lead;
    if (specServices) specServices.textContent = project.services;

    // Narrative details
    const storyTitle = document.getElementById("detail-story-title");
    const storyText = document.getElementById("detail-story-text");

    if (storyTitle) storyTitle.textContent = project.storyTitle;
    if (storyText) storyText.innerHTML = project.storyHtml;

    // Metrics Row
    const metric1Val = document.getElementById("metric-1-val");
    const metric1Lbl = document.getElementById("metric-1-lbl");
    const metric2Val = document.getElementById("metric-2-val");
    const metric2Lbl = document.getElementById("metric-2-lbl");
    const metric3Val = document.getElementById("metric-3-val");
    const metric3Lbl = document.getElementById("metric-3-lbl");

    if (metric1Val) metric1Val.textContent = project.highlight1Val;
    if (metric1Lbl) metric1Lbl.textContent = project.highlight1Lbl;
    if (metric2Val) metric2Val.textContent = project.highlight2Val;
    if (metric2Lbl) metric2Lbl.textContent = project.highlight2Lbl;
    if (metric3Val) metric3Val.textContent = project.highlight3Val;
    if (metric3Lbl) metric3Lbl.textContent = project.highlight3Lbl;

    // Mosaic Gallery Renderer
    const galleryContainer = document.getElementById("detail-gallery-container");
    if (galleryContainer && project.gallery) {
      galleryContainer.innerHTML = ""; // Clear static markup

      project.gallery.forEach((photo, idx) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = `gallery-mosaic-item${idx === 0 ? " item-large" : ""}`;
        
        const img = document.createElement("img");
        img.src = photo.url;
        img.alt = photo.alt;
        img.className = "gallery-img-clickable";
        img.setAttribute("loading", "lazy");

        itemDiv.appendChild(img);
        galleryContainer.appendChild(itemDiv);
      });
    }

    // Pagination Links Builder
    const pagPrevLink = document.getElementById("pag-prev-link");
    const pagNextLink = document.getElementById("pag-next-link");
    const pagPrevName = document.getElementById("pag-prev-name");
    const pagNextName = document.getElementById("pag-next-name");

    if (pagPrevLink && pagPrevName && project.prev) {
      const prevProj = projectDatabase[project.prev];
      pagPrevLink.setAttribute("href", `/project-details.html?id=${project.prev}`);
      pagPrevName.textContent = prevProj.title;
    }
    if (pagNextLink && pagNextName && project.next) {
      const nextProj = projectDatabase[project.next];
      pagNextLink.setAttribute("href", `/project-details.html?id=${project.next}`);
      pagNextName.textContent = nextProj.title;
    }

    /* ==========================================================================
       7. Lightbox Modal Integration (Dynamic on details page)
       ========================================================================== */
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-main-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close-btn");

    if (lightboxModal && lightboxImg) {
      // Bind click listeners dynamically to generated images
      const clickableImages = document.querySelectorAll(".gallery-img-clickable");
      
      clickableImages.forEach(img => {
        img.addEventListener("click", () => {
          lightboxModal.style.display = "block";
          lightboxImg.src = img.src;
          if (lightboxCaption) lightboxCaption.textContent = img.alt || "Architectural Perspective";
          document.body.style.overflow = "hidden"; // Lock scroll
        });
      });

      // Close modal actions
      const closeModal = () => {
        lightboxModal.style.display = "none";
        document.body.style.overflow = ""; // Restore scroll
      };

      if (lightboxClose) {
        lightboxClose.addEventListener("click", closeModal);
      }

      // Close if clicking outside the main photo canvas
      lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
          closeModal();
        }
      });

      // Escape key to close modal
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightboxModal.style.display === "block") {
          closeModal();
        }
      });
    }
  }

  // Re-create lucide icons after any dynamic rendering to catch newly added icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});
