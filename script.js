/**
 * Olakunle Tomomewo - Portfolio Logic
 * Tab switching, Dark/Light theme toggle, Project filters, Modals & Credly verification
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  const sunSvg = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;

  const moonSvg = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.innerHTML = moonSvg;
      if (themeText) themeText.textContent = 'Dark Mode';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.innerHTML = sunSvg;
      if (themeText) themeText.textContent = 'Light Mode';
    }
    localStorage.setItem('theme-preference', theme);
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme-preference') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} theme`);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Tab Navigation
  // -------------------------------------------------------------------------
  const navButtons = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  function switchTab(targetTabId) {
    // Deactivate all buttons & panels
    navButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));

    // Activate matching button
    const activeBtn = document.querySelector(`.nav-tab-btn[data-target="${targetTabId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Activate matching panel
    const activePanel = document.getElementById(targetTabId);
    if (activePanel) {
      activePanel.classList.add('active');
      // Scroll to content panel top on mobile viewports
      if (window.innerWidth <= 900) {
        activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, null, `#${targetTabId}`);
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) switchTab(target);
    });
  });

  // Handle URL hash on initial load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    switchTab(initialHash);
  }

  // -------------------------------------------------------------------------
  // 3. Projects Category Filter
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 4. Modal System (Architecture View & Credly Verification & Resume)
  // -------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(title, contentHtml) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = contentHtml;
    if (modalBackdrop) modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // -------------------------------------------------------------------------
  // 5. Credly AWS Badge Verification Handlers
  // -------------------------------------------------------------------------
  const badgeData = {
    ccp: {
      title: "AWS Certified Cloud Practitioner",
      level: "Foundational",
      levelClass: "badge-pill-ccp",
      badgeImg: "assets/badges/aws-ccp.svg",
      issueDate: "November 14, 2023",
      expirationDate: "November 14, 2026",
      credentialId: "AWS-CCP-19384722",
      issuer: "Amazon Web Services Training and Certification",
      skills: ["Cloud Concepts", "Security & Compliance", "AWS Core Services", "Billing & Pricing", "Cloud Economics", "Well-Architected Framework"],
      description: "Earners of this certification have a proven overall understanding of the AWS Cloud platform, covering cloud fundamentals, security, architecture, pricing, and support models."
    },
    saa: {
      title: "AWS Certified Solutions Architect – Associate",
      level: "Associate",
      levelClass: "badge-pill-saa",
      badgeImg: "assets/badges/aws-saa.svg",
      issueDate: "January 20, 2025",
      expirationDate: "January 20, 2028",
      credentialId: "AWS-SAA-83920194",
      issuer: "Amazon Web Services Training and Certification",
      skills: ["Multi-Tier Architecture", "VPC Networking", "Auto-Scaling", "IAM Security", "High Availability", "Fault Tolerance", "Cost Optimization", "Amazon S3/EFS/RDS"],
      description: "Earners of this credential demonstrate comprehensive knowledge of how to architect and deploy secure, resilient, high-performing, and cost-effective applications on AWS."
    },
    sec: {
      title: "AWS Certified Security – Specialty",
      level: "Specialty",
      levelClass: "badge-pill-sec",
      badgeImg: "assets/badges/aws-security-specialty.svg",
      issueDate: "March 18, 2025",
      expirationDate: "March 18, 2028",
      credentialId: "AWS-SEC-49201855",
      issuer: "Amazon Web Services Training and Certification",
      skills: ["Incident Response", "Logging & Monitoring", "Infrastructure Security", "IAM & Access Management", "Data Protection & KMS", "CloudTrail & GuardDuty", "AWS WAF & Shield"],
      description: "Earners of this certification validate expertise in securing data and workloads in the AWS Cloud, including data classification, encryption mechanisms, secure internet protocols, and incident response."
    }
  };

  document.querySelectorAll('[data-verify-badge]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const badgeKey = btn.getAttribute('data-verify-badge');
      const b = badgeData[badgeKey];
      if (!b) return;

      const modalHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:18px;">
          <div style="width:130px; height:155px; filter:drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
            <img src="${b.badgeImg}" alt="${b.title}" style="width:100%; height:100%; object-fit:contain;">
          </div>
          
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge-level-pill ${b.levelClass}">${b.level}</span>
            <span style="font-size:0.75rem; font-weight:800; background:#ff5a00; color:#fff; padding:3px 10px; border-radius:999px;">
              ✓ Verified on Credly
            </span>
          </div>

          <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-top:2px;">
            ${b.title}
          </h3>

          <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5; max-width:500px;">
            ${b.description}
          </p>

          <div style="width:100%; background:var(--bg-card-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; text-align:left; display:grid; grid-template-columns:1fr 1fr; gap:12px 18px; font-size:0.82rem;">
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:800; text-transform:uppercase;">Issued To</div>
              <div style="font-weight:700; color:var(--text-primary);">Olakunle Tomomewo</div>
            </div>
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:800; text-transform:uppercase;">Issuer</div>
              <div style="font-weight:700; color:var(--text-primary);">Amazon Web Services</div>
            </div>
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:800; text-transform:uppercase;">Issue Date</div>
              <div style="font-weight:700; color:var(--text-primary);">${b.issueDate}</div>
            </div>
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:800; text-transform:uppercase;">Expiration Date</div>
              <div style="font-weight:700; color:var(--accent-green);">${b.expirationDate}</div>
            </div>
            <div style="grid-column: span 2;">
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:800; text-transform:uppercase;">Credential Verification ID</div>
              <div style="font-family:'JetBrains Mono', monospace; font-weight:700; color:var(--accent-blue-light); word-break:break-all;">${b.credentialId}</div>
            </div>
          </div>

          <div style="width:100%; text-align:left;">
            <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Validated Core Skills</div>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${b.skills.map(s => `<span class="tech-tag" style="background:var(--bg-surface);">${s}</span>`).join('')}
            </div>
          </div>

          <div style="display:flex; gap:12px; width:100%; margin-top:8px;">
            <button onclick="navigator.clipboard.writeText('${b.credentialId}'); showToast('Credential ID copied to clipboard!');" class="btn-badge-verify" style="flex:1;">
              📋 Copy Credential ID
            </button>
            <a href="https://www.credly.com/organizations/amazon-web-services/badges" target="_blank" rel="noopener noreferrer" class="btn-badge-verify" style="flex:1; background:var(--accent-blue); color:#fff; border-color:var(--accent-blue);">
              🔗 Credly Registry ↗
            </a>
          </div>
        </div>
      `;

      openModal("AWS Official Credential Verification", modalHtml);
    });
  });

  // -------------------------------------------------------------------------
  // 6. Project Architecture Details Modal
  // -------------------------------------------------------------------------
  const projectDetailsData = {
    p1: {
      title: "Enterprise Multi-Region AWS Landing Zone",
      archType: "Multi-Account Architecture with Transit Gateway Hub & Spoke",
      problem: "The organization experienced account sprawl, lack of centralized security controls, disparate billing, and manual VPC peering that reached AWS routing limits.",
      solution: "Engineered a scalable multi-account AWS Organization managed via Terraform and AWS Control Tower. Implemented an Inspection VPC with AWS Network Firewall and centralized egress. Transit Gateway connects 8 account VPCs with route-table segmentation.",
      metrics: ["Reduced network latency by 28%", "100% automated account vending machine via Terraform", "SOC2 Type II compliance audit passed"],
      diagram: `
+-------------------------------------------------------------+
|                     AWS Control Tower                       |
+-------------------------------------------------------------+
         |                       |                     |
+-----------------+     +-----------------+   +---------------+
| Central Egress  |     | Central Log &   |   | Transit       |
| & Network FW    |<--->| Security Hub    |<->| Gateway Hub   |
+-----------------+     +-----------------+   +---------------+
                                                     ^
         +-------------------------------------------+
         |                     |                     |
+-----------------+   +-----------------+   +-----------------+
| Prod VPC (us-e1)|   | Staging VPC     |   | Dev VPC         |
| EKS + Aurora    |   | App Runner + RDS|   | Sandbox Envs    |
+-----------------+   +-----------------+   +-----------------+
      `
    },
    p2: {
      title: "Production Kubernetes Platform with EKS & ArgoCD",
      archType: "GitOps Managed EKS Infrastructure with Karpenter",
      problem: "Traditional cluster autoscaler was sluggish during traffic spikes (taking 6+ minutes to provision new EC2 nodes) and manual deployments caused occasional configuration drift.",
      solution: "Migrated to Amazon EKS v1.29 using Karpenter for sub-minute node provisioning with heterogeneous Spot/On-Demand instance pools. Implemented GitOps using ArgoCD with Helm charts, Istio service mesh for traffic routing, and external-dns + cert-manager for automatic TLS.",
      metrics: ["Node provisioning time dropped from 6m to 42s", "AWS compute cost reduced by 44% with Spot adoption", "Zero failed releases across 120+ deployments"],
      diagram: `
[Git Repository] ---> [ArgoCD Controller] ---> [Amazon EKS 1.29]
                                                      |
    +-------------------------------------------------+
    |                     |                           |
[Istio Ingress]    [Karpenter Autoscaler]    [cert-manager]
    |                     |                           |
[Pod Fleet]       [EC2 Spot Pools]          [Let's Encrypt]
      `
    },
    p3: {
      title: "Automated FinOps Cloud Cost Engine",
      archType: "Serverless Event-Driven AWS Cost Optimization",
      problem: "Overlooked unattached EBS volumes, old snapshots, and idle test RDS instances caused AWS bills to continuously inflate without clear team attribution.",
      solution: "Developed an automated serverless engine with AWS Lambda, EventBridge, and Boto3. Scans all accounts every 24 hours, identifies unattached EBS volumes, deletes snapshots older than policy, and automatically stops non-production RDS instances outside working hours.",
      metrics: ["$42,000+ verified annual AWS cloud savings", "Automated Slack notification with 1-click override", "Zero disruption to engineering team workflows"],
      diagram: `
[EventBridge Cron] ---> [Lambda Inspector] ---> [AWS Cost Explorer]
                               |
               +---------------+---------------+
               |                               |
       [Tag Audit Engine]              [Orphan Resource Cleaner]
               |                               |
       [Slack Webhook]                 [Tagged S3 Reports]
      `
    },
    p4: {
      title: "DevSecOps Automated Shift-Left CI/CD Pipeline",
      archType: "Secure Software Supply Chain & Container Security",
      problem: "Vulnerabilities were being discovered late in staging, and developers lacked instant automated feedback on Docker image security.",
      solution: "Built a hardened GitHub Actions workflow that executes SAST via SonarQube, runs container image scanning via Trivy, cryptographically signs images with Cosign, and publishes to Amazon ECR. Deploys to AWS ECS Fargate using Blue/Green deployments via CodeDeploy.",
      metrics: ["100% of production images scanned and signed", "Deployment speed improved by 65%", "Zero high/critical CVEs reached production"],
      diagram: `
[Developer Git Push] ---> [SonarQube SAST] ---> [Docker Build]
                                                      |
                                               [Trivy Scan]
                                                      |
[ECS Fargate Blue/Green] <--- [Cosign Sign] <--- [Amazon ECR]
      `
    }
  };

  document.querySelectorAll('[data-project-details]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-project-details');
      const p = projectDetailsData[pKey];
      if (!p) return;

      const modalHtml = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:inline-block; font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--accent-blue-light); background:rgba(37,99,235,0.15); padding:4px 10px; border-radius:999px; width:fit-content;">
            ${p.archType}
          </div>

          <h3 style="font-size:1.3rem; font-weight:800; color:var(--text-primary); line-height:1.3;">
            ${p.title}
          </h3>

          <div>
            <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--accent-orange); margin-bottom:4px;">
              ⚠️ The Challenge
            </div>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
              ${p.problem}
            </p>
          </div>

          <div>
            <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--accent-blue-light); margin-bottom:4px;">
              💡 Engineering Solution
            </div>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
              ${p.solution}
            </p>
          </div>

          <div>
            <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px;">
              🏗️ High-Level Topology
            </div>
            <pre style="background:var(--bg-body); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px; font-family:'JetBrains Mono', monospace; font-size:0.75rem; color:var(--text-primary); overflow-x:auto; line-height:1.4;">${p.diagram.trim()}</pre>
          </div>

          <div>
            <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--accent-green); margin-bottom:6px;">
              📈 Business Impact & Metrics
            </div>
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:6px; font-size:0.85rem; color:var(--text-primary);">
              ${p.metrics.map(m => `<li style="display:flex; align-items:center; gap:8px;"><span style="color:var(--accent-green); font-weight:800;">✓</span> ${m}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      openModal("Architecture Deep Dive", modalHtml);
    });
  });

  // -------------------------------------------------------------------------
  // 7. Contact Form Handler
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const submitBtn = contactForm.querySelector('.form-submit-btn');

      if (!nameInput || !emailInput || !nameInput.value.trim() || !emailInput.value.trim()) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Simulate sending
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>✓ Message Dispatched!</span>`;
        submitBtn.style.background = 'var(--accent-green)';
        showToast('Thank you! Olakunle has received your message.');

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Copy to Clipboard Utility
  // -------------------------------------------------------------------------
  window.copyEmail = function(e) {
    if (e) e.preventDefault();
    const email = "olakunle@tomomewo.cloud";
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Copied ${email} to clipboard!`);
    }).catch(() => {
      showToast(`Email: ${email}`);
    });
  };

  // -------------------------------------------------------------------------
  // 9. Resume Viewer / Download Modal
  // -------------------------------------------------------------------------
  window.openResumeModal = function(e) {
    if (e) e.preventDefault();

    const resumeHtml = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:12px;">
          <div>
            <h3 style="font-size:1.3rem; font-weight:800; color:var(--text-primary);">Olakunle Tomomewo</h3>
            <div style="font-size:0.85rem; color:var(--accent-blue-light); font-weight:700;">Senior Cloud & DevOps Engineer | 3x AWS Certified</div>
          </div>
          <button onclick="window.print()" class="btn-badge-verify" style="padding:6px 14px; font-size:0.8rem; background:var(--accent-blue); color:#fff; border-color:var(--accent-blue);">
            🖨️ Print / Save PDF
          </button>
        </div>

        <div style="font-size:0.82rem; color:var(--text-secondary); display:grid; grid-template-columns:1fr 1fr; gap:6px 14px;">
          <div><strong>Email:</strong> olakunle@tomomewo.cloud</div>
          <div><strong>Location:</strong> Lagos, Nigeria (Open to Remote)</div>
          <div><strong>Certifications:</strong> AWS SAA, AWS SEC-Spec, AWS CCP, CKA, Terraform</div>
          <div><strong>LinkedIn:</strong> linkedin.com/in/olakunle-tomomewo</div>
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:12px;">
          <h4 style="font-size:0.9rem; font-weight:800; text-transform:uppercase; color:var(--accent-orange); margin-bottom:6px;">Summary</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
            Accomplished Cloud Infrastructure and DevOps Engineer with 5+ years of experience designing, provisioning, and managing scalable, fault-tolerant AWS environments. Specialist in Terraform IaC, Kubernetes (EKS), automated CI/CD pipelines, cloud security hardening, and FinOps cost optimization.
          </p>
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:12px;">
          <h4 style="font-size:0.9rem; font-weight:800; text-transform:uppercase; color:var(--accent-blue-light); margin-bottom:8px;">Core Experience</h4>
          
          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--text-primary); font-size:0.88rem;">
              <span>Senior Cloud & DevOps Engineer</span>
              <span style="color:var(--text-muted); font-size:0.8rem;">2022 - Present</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Apex Cloud Solutions • Enterprise Consulting</div>
            <ul style="font-size:0.8rem; color:var(--text-secondary); padding-left:18px; line-height:1.5;">
              <li>Architected multi-region AWS Landing Zones for 8 enterprise clients utilizing Terraform and Control Tower.</li>
              <li>Engineered zero-downtime Blue/Green deployment pipelines via GitHub Actions and AWS ECS/EKS.</li>
              <li>Spearheaded FinOps audit slashing monthly AWS compute and storage expenditures by 38%.</li>
            </ul>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--text-primary); font-size:0.88rem;">
              <span>Cloud Infrastructure Engineer</span>
              <span style="color:var(--text-muted); font-size:0.8rem;">2020 - 2022</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:4px;">Nova Technologies • Infrastructure Operations</div>
            <ul style="font-size:0.8rem; color:var(--text-secondary); padding-left:18px; line-height:1.5;">
              <li>Managed 15+ production Kubernetes clusters running microservices in high-traffic eCommerce.</li>
              <li>Configured Prometheus and Grafana alerting systems achieving 99.99% uptime SLA.</li>
            </ul>
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:8px;">
          <button onclick="downloadResumeText()" class="btn-badge-verify" style="width:100%; background:var(--accent-blue); color:#fff; border-color:var(--accent-blue);">
            📥 Download Resume File (.txt)
          </button>
        </div>
      </div>
    `;

    openModal("Curriculum Vitae", resumeHtml);
  };

  window.downloadResumeText = function() {
    const resumeText = `OLAKUNLE TOMOMEWO
Senior Cloud & DevOps Engineer | 3x AWS Certified
Email: olakunle@tomomewo.cloud | Location: Lagos, Nigeria (Open to Remote)
LinkedIn: linkedin.com/in/olakunle-tomomewo | GitHub: github.com/olakunle-tomomewo

PROFESSIONAL SUMMARY
Senior Cloud & DevOps Engineer with 5+ years of production experience architecting, securing, and operating mission-critical AWS infrastructure. Expert in Terraform, Kubernetes (EKS), CI/CD pipelines, DevSecOps, and FinOps cloud cost optimization.

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (SAA-C03) [ID: AWS-SAA-83920194]
- AWS Certified Security – Specialty (SCS-C02) [ID: AWS-SEC-49201855]
- AWS Certified Cloud Practitioner (CLF-C02) [ID: AWS-CCP-19384722]
- HashiCorp Certified: Terraform Associate
- Certified Kubernetes Administrator (CKA)

CORE COMPETENCIES
- Cloud: AWS (VPC, Transit Gateway, EKS, ECS, Lambda, IAM, KMS, Route53, RDS, S3)
- IaC & Automation: Terraform, Terragrunt, CloudFormation, Ansible, Python, Bash
- Containers: Docker, Kubernetes, Helm, ArgoCD, Karpenter, Istio
- CI/CD & Security: GitHub Actions, GitLab CI, SonarQube, Trivy, Cosign, AWS WAF
- Observability: Prometheus, Grafana, AWS CloudWatch, Datadog

EXPERIENCE
Apex Cloud Solutions | Senior Cloud & DevOps Engineer (2022 - Present)
- Designed multi-account AWS Organization architectures with Terraform and Control Tower.
- Reduced cloud compute bills by $42,000 annually via automated Lambda FinOps tools.
- Deployed Amazon EKS platforms scaling over 50 microservices using Karpenter and ArgoCD.

Nova Technologies | Cloud Infrastructure Engineer (2020 - 2022)
- Operated production Linux & AWS environments maintaining 99.99% system availability.
- Automated Docker container security scans and vulnerability remediation with Trivy.
`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Olakunle_Tomomewo_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Resume downloaded successfully!');
  };

  // -------------------------------------------------------------------------
  // 10. Toast Notification
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>💬</span> <span>${message}</span>`;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
  window.showToast = showToast;
});
