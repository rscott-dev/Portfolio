async function init() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        const timeline = document.getElementById('experience-timeline');

        timeline.innerHTML = data.experience.map((comp, compIndex) => {
            const totalTenure = calculate_company_tenure(comp.roles);
            const hasMultiple = comp.roles.length > 1;

            return `
            <div class="exp-item">
                <img class="company-logo" 
                     src="${comp.image}" 
                     onerror="this.src='https://via.placeholder.com/48?text=🏢'" 
                     alt="${comp.company}">
                
                <div class="exp-content">
                    <h3 style="margin:0; font-size:1.1rem;">${comp.company}</h3>
                    <span class="company-name" style="color:var(--li-muted); font-size:0.9rem;">
                        ${totalTenure} · ${comp.location}
                    </span>
                    
                    <div class="roles-container">
                        ${comp.roles.map((role, roleIndex) => `
                            <div class="role-entry ${hasMultiple ? 'show-dot' : ''}">
                                <h4 class="role-title" style="margin:0; font-size:1rem;">${role.title}</h4>
                                <p class="exp-meta" style="color:var(--li-muted); font-size:0.85rem; margin:4px 0;">
                                    ${calculate_time_difference(role.duration_start, role.duration_end)} · 
                                    ${calculate_total_experience(role.duration_start, role.duration_end)}
                                </p>
                                
                                <div class="exp-summary" style="font-size:0.9rem; margin-top:8px;">
                                    ${role.summary}
                                    <div id="details-${compIndex}-${roleIndex}" class="more-content">
                                        <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
                                        <strong>Key Achievements:</strong>
                                        <p>${role.details}</p>
                                    </div>
                                    <button class="btn-toggle" onclick="toggleDetails('${compIndex}-${roleIndex}', this)">
                                        ... see more
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `}).join('');

        const projectGrid = document.getElementById('project-grid');
        projectGrid.innerHTML = data.projects.map(p => `
            <div class="project-card">
                <img src="${p.image}">
                <div class="p-pad">
                    <h4>${p.title}</h4>
                    <p style="font-size:0.8rem; color:#666">${p.description}</p>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Error loading portfolio:", e);
    }
}

function calculate_company_tenure(roles) {
    const starts = roles.map(r => new Date(r.duration_start));
    const ends = roles.map(r => r.duration_end.toLowerCase() === 'present' ? new Date() : new Date(r.duration_end));
    const minStart = new Date(Math.min(...starts));
    const maxEnd = new Date(Math.max(...ends));
    return calculate_total_experience(minStart, maxEnd);
}

function toggleDetails(id, btn) {
    const details = document.getElementById(`details-${id}`);
    const isExpanded = details.classList.toggle('active');
    btn.innerText = isExpanded ? 'show less' : '... see more';
}

function calculate_total_experience(startDate, endDate) {
    const start = new Date(startDate);
    const end = (typeof endDate === 'string' && endDate.toLowerCase() === 'present') ? new Date() : new Date(endDate);
    let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (totalMonths <= 0) totalMonths = 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    let result = '';
    if (years > 0) result += `${years} yr${years > 1 ? 's' : ''} `;
    if (months > 0) result += `${months + 1} mo${months > 1 ? 's' : ''}`;
    return result.trim() || "1 mo";
}

function calculate_time_difference(startDate, endDate) {
    const start = new Date(startDate);
    const options = { year: 'numeric', month: 'short' };
    const startStr = start.toLocaleDateString('en-US', options);
    const endStr = (typeof endDate === 'string' && endDate.toLowerCase() === 'present') ? 'Present' : new Date(endDate).toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
}

document.addEventListener('DOMContentLoaded', init);