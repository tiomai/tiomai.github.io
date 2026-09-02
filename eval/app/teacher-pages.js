(function(){const evalPath=location.pathname.includes('/eval/');if(!window.EXAI_CONTEXT_READY&&!document.querySelector('script[src$="app/context-bootstrap.js"]')){const script=document.createElement('script');script.src=evalPath?'/eval/app/context-bootstrap.js':'app/context-bootstrap.js';document.head.append(script)}const loadRenderer=()=>{if(document.querySelector('script[data-performance-renderers]'))return;const script=document.createElement('script');script.src=evalPath?'/eval/app/performance-teacher-renderers.js':'app/performance-teacher-renderers.js';script.dataset.performanceRenderers='true';document.head.append(script)};const waitForContext=()=>window.EXAI_CONTEXT_READY?Promise.resolve(window.EXAI_CONTEXT_READY).then(loadRenderer):setTimeout(waitForContext,0);waitForContext()})();
addEventListener('DOMContentLoaded', () => {
  const enhanceLateSelect=select=>{if(select.parentElement.querySelector('.ds-select'))return;const root=document.createElement('div');root.className='ds-select';const button=document.createElement('button');button.type='button';button.className='ds-select-button';button.innerHTML=`<span>${select.options[select.selectedIndex]?.textContent||''}</span><span class="ds-select-chevron"></span>`;const menu=document.createElement('div');menu.className='ds-select-menu';[...select.options].forEach((native,index)=>{const option=document.createElement('button');option.type='button';option.className='ds-select-option';option.textContent=native.textContent;option.onclick=()=>{select.selectedIndex=index;select.dispatchEvent(new Event('change',{bubbles:true}));button.firstElementChild.textContent=native.textContent;root.classList.remove('open')};menu.append(option)});button.onclick=()=>root.classList.toggle('open');root.append(button,menu);select.parentElement.append(root)};
  const classPerformanceHeading=[...document.querySelectorAll('.teacher-section-head h2')].find(node=>node.textContent.trim()==='Performance by class')?.closest('.teacher-section-head');
  if(classPerformanceHeading){classPerformanceHeading.nextElementSibling?.remove();classPerformanceHeading.remove()}
  document.querySelectorAll('.subject-tabs button').forEach(button => {
    button.addEventListener('click', () => {
      button.parentElement.querySelector('.active')?.classList.remove('active');
      button.classList.add('active');
      document.querySelectorAll('[data-subject-panel]').forEach(panel => {
        panel.hidden = panel.dataset.subjectPanel !== button.dataset.subject;
      });
    });
  });

  document.querySelectorAll('[data-table-search]').forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      document.querySelector(input.dataset.tableSearch)?.querySelectorAll('tbody tr').forEach(row => {
        row.hidden = !row.textContent.toLowerCase().includes(query);
      });
    });
  });

  document.querySelectorAll('tr[data-href]').forEach(row => {
    row.classList.add('click-row'); row.tabIndex = 0;
    const open = () => { location.href = row.dataset.href; };
    row.addEventListener('click', open);
    row.addEventListener('keydown', event => { if (event.key === 'Enter') open(); });
  });

  const filters = [...document.querySelectorAll('[data-demo-filter]')];
  const updateDemoNumbers = () => {
    const seed = filters.reduce((sum, filter) => sum + filter.selectedIndex, 0);
    document.querySelectorAll('[data-dynamic-number]').forEach((node, index) => {
      const value = Number(node.dataset.dynamicNumber) + ((seed + index) % 5 - 2);
      node.textContent = node.dataset.suffix === '%' ? `${value}%` : String(value + seed * 3);
    });
  };
  filters.forEach(filter => filter.addEventListener('change', updateDemoNumbers));
  if (filters.length) updateDemoNumbers();

  document.querySelectorAll('.stacked-column').forEach(column=>{const values=(column.dataset.tip||'').match(/\d+/g)?.slice(-3).map(Number)||[];if(values.length){const total=values.reduce((sum,value)=>sum+value,0),label=document.createElement('strong');label.textContent=total;column.append(label)}});

  const individualResults=document.querySelector('#individualResults');
  const subjectTabs=document.querySelector('.subject-tabs');
  if(individualResults&&subjectTabs){const subjectSelect=document.createElement('label');subjectSelect.className='select-wrap teacher-subject-select';subjectSelect.innerHTML='<select aria-label="Select subject"><option value="english">English</option><option value="math">Math</option></select>';subjectTabs.replaceWith(subjectSelect);const nativeSubject=subjectSelect.querySelector('select');nativeSubject.addEventListener('change',event=>document.querySelectorAll('[data-subject-panel]').forEach(panel=>panel.hidden=panel.dataset.subjectPanel!==event.target.value));if(window.EXAI_ENHANCE_SELECTS)window.EXAI_ENHANCE_SELECTS();else enhanceLateSelect(nativeSubject)}
  if(individualResults&&!document.querySelector('#teacherPracticePerformance')){
    const monthlyHeading=[...document.querySelectorAll('.teacher-section-head h2')].find(node=>node.textContent.trim()==='Monthly performance summary')?.closest('.teacher-section-head');
    if(monthlyHeading){const overview=document.createElement('div');overview.className='teacher-student-overview';overview.innerHTML=`<section class="v2-panel"><h2>Score trend</h2><p>Monthly weighted score across completed work</p><div class="trend-chart"><svg viewBox="0 0 520 190" role="img" aria-label="Monthly score trend"><path class="axis" d="M35 20V155H505M35 88H505M35 20H505"/><path class="area" d="M35 155 L70 62 L138 72 L206 34 L274 88 L342 72 L410 62 L478 62 L478 155Z"/><path class="line" d="M70 62 L138 72 L206 34 L274 88 L342 72 L410 62 L478 62"/><text class="chart-label" x="5" y="24">100%</text><text class="chart-label" x="13" y="92">50%</text><text class="chart-label" x="60" y="176">Jan</text><text class="chart-label" x="128" y="176">Feb</text><text class="chart-label" x="196" y="176">Mar</text><text class="chart-label" x="264" y="176">Apr</text><text class="chart-label" x="332" y="176">May</text><text class="chart-label" x="400" y="176">Jun</text><text class="chart-label" x="468" y="176">Jul</text></svg></div></section>`;monthlyHeading.before(overview);const insight=document.createElement('section');insight.className='teacher-panel teacher-student-insight';insight.innerHTML=`<h2>AI performance insight</h2><p>Based on completed scored work in the selected period.</p><div class="ai-insight-grid"><article><small>PERFORMANCE SIGNAL</small><h3>Reading is currently strongest</h3><p>Grammar has enough scored evidence to recommend focused work on sentence structure and tense.</p></article><article><small>FOCUS NEXT</small><h3>Grammar</h3><p>Complete another targeted set to strengthen the evidence.</p></article><article><small>DATA CONFIDENCE</small><h3>Developing</h3><p>Recommendations improve as more scored questions are completed.</p></article></div>`;overview.after(insight)}
  }

  if(individualResults){
    const monthlyHeading=[...document.querySelectorAll('.teacher-section-head h2')].find(node=>node.textContent.trim()==='Monthly performance summary')?.closest('.teacher-section-head'),monthlySummary=monthlyHeading?.nextElementSibling,overview=document.querySelector('.teacher-student-overview'),englishMatrix=document.querySelector('[data-subject-panel="english"]'),mathMatrix=document.querySelector('[data-subject-panel="math"]'),studentInsight=document.querySelector('.teacher-student-insight');
    if(monthlyHeading&&overview){monthlyHeading.querySelector('h2').textContent='Monthly performance summary';monthlySummary?.classList.remove('teacher-recent-months');monthlyHeading.before(overview)}
    if(overview&&englishMatrix)overview.append(englishMatrix);if(overview&&mathMatrix)overview.append(mathMatrix);
    if(overview&&mathMatrix){mathMatrix.classList.add('teacher-math-period-comparison');const heading=mathMatrix.querySelector('.teacher-section-head');if(heading&&!heading.querySelector('.teacher-topic-comparison-copy')){const copy=document.createElement('p');copy.className='teacher-topic-comparison-copy';copy.textContent='Current period compared with previous 30 days.';heading.append(copy);const legend=document.createElement('div');legend.className='teacher-marker-legend';legend.innerHTML='<span><i></i>Current period</span><span><i></i>Previous 30 days</span>';heading.after(legend)}const previousAdjustments=[7,4,-3,6,2,-2];mathMatrix.querySelectorAll('.math-skill-list .skill-row').forEach((row,index)=>{const score=row.querySelector(':scope>span'),current=parseInt(score?.textContent);if(!Number.isFinite(current))return;const previous=Math.max(0,Math.min(100,current-previousAdjustments[index%previousAdjustments.length])),delta=current-previous,track=row.querySelector('.skill-track');track.className='teacher-math-marker-track';track.setAttribute('aria-label',`Current ${current}%, previous ${previous}%`);track.innerHTML=`<i style="--current:${current}%"><span style="--previous:${previous}%"><small>${previous}%</small></span></i>`;score.className='teacher-math-current-score';score.innerHTML=`<b>${current}%</b><em class="${delta>0?'up':delta<0?'down':'flat'}">${delta>0?`↑ ${delta}`:delta<0?`↓ ${Math.abs(delta)}`:'—'}</em>`})}
    const teacherSubject=document.querySelector('.teacher-subject-select select'),syncSubjectLayout=()=>overview?.classList.toggle('teacher-math-performance-layout',teacherSubject?.value==='math');teacherSubject?.addEventListener('change',syncSubjectLayout);syncSubjectLayout();
    if(studentInsight){studentInsight.className='ai-insight-panel teacher-student-insight';studentInsight.innerHTML=`<header><span class="ai-badge">AI</span><div><h3>AI performance insight</h3><p>Based on completed scored work in the selected period.</p></div></header><div class="ai-insight-grid"><section><small>PERFORMANCE SIGNAL</small><b>Reading is currently strongest. Grammar has enough scored evidence to recommend focused work on sentence structure and tense.</b></section><section><small>FOCUS NEXT</small><b>Grammar</b><p>Complete another targeted set to strengthen the evidence and update this recommendation.</p></section><section><small>DATA CONFIDENCE</small><b>Developing</b><p>Recommendations become more reliable as more scored questions are completed.</p></section></div>`;individualResults.closest('.teacher-table-wrap')?.after(studentInsight)}
    if(!document.querySelector('#individualResultsPagination')){const pagination=document.createElement('div');pagination.id='individualResultsPagination';pagination.className='teacher-pagination';pagination.innerHTML='<button disabled>Previous</button><span>1–10 of 24</span><button>Next</button>';individualResults.closest('.teacher-table-wrap')?.after(pagination)}
  }

  const performancePeriod = document.querySelector('#teacherPerformancePeriod');
  if (performancePeriod) {
    [...performancePeriod.options].filter(option=>/school term|school year/i.test(option.textContent)).forEach(option=>option.remove());
    performancePeriod.parentElement.querySelector('.ds-select')?.remove();if(window.EXAI_ENHANCE_SELECTS)window.EXAI_ENHANCE_SELECTS();else enhanceLateSelect(performancePeriod);
    const controls = performancePeriod.closest('.teacher-controls'); controls.style.position = 'relative';
    const picker = document.createElement('div'); picker.className = 'calendar-popover performance-calendar'; picker.hidden = true;
    picker.innerHTML = '<div class="calendar-head"><b>August 2026</b><span>Select start and end dates</span></div><div class="calendar-grid"></div>';
    controls.append(picker); const grid = picker.querySelector('.calendar-grid'); let picks = [];
    grid.innerHTML = ['S','M','T','W','T','F','S', ...Array.from({length:31}, (_,i)=>i+1)].map((day,index)=>index<7?`<b>${day}</b>`:`<button data-day="${day}">${day}</button>`).join('');
    performancePeriod.addEventListener('change',()=>{picker.hidden=performancePeriod.value!=='Custom range'});
    grid.addEventListener('click',event=>{const button=event.target.closest('[data-day]');if(!button)return;if(picks.length===2)picks=[];picks.push(Number(button.dataset.day));grid.querySelectorAll('button').forEach(dayButton=>{const day=Number(dayButton.dataset.day);dayButton.classList.toggle('range',picks.length===2&&day>=Math.min(...picks)&&day<=Math.max(...picks));dayButton.classList.toggle('edge',picks.includes(day))});if(picks.length===2){const label=`${Math.min(...picks)}–${Math.max(...picks)} Aug 2026`;performancePeriod.options[performancePeriod.options.length-1].text=label;performancePeriod.closest('.select-wrap')?.querySelector('.ds-select-button>span:first-child')?.replaceChildren(label);setTimeout(()=>{picker.hidden=true},350)}});
    const classSelect=document.querySelector('#teacherPerformanceClass'),subjectSelect=document.querySelector('#teacherPerformanceSubject');
    const updatePerformance=()=>{
      const all=classSelect.selectedIndex===0,total=all?60:20,periodFactor=[1,.96,1.04,.91][performancePeriod.selectedIndex]||1,subjectOffset=subjectSelect.selectedIndex?3:0;
      const active=Math.min(total,Math.round(total*(all ? .9 : .88)*periodFactor)),completion=Math.min(98,Math.round(82*periodFactor)+subjectOffset),average=Math.min(95,Math.round(73*periodFactor)+subjectOffset);
      const values={students:total,active,completion:`${completion}%`,average:`${average}%`};document.querySelectorAll('[data-performance-kpi]').forEach(node=>node.textContent=values[node.dataset.performanceKpi]);
      const ratios=subjectSelect.selectedIndex?[.15,.3,.45,.1]:[.22,.37,.38,.03],counts=ratios.map((ratio,index)=>index===3?0:Math.round(total*ratio));counts[3]=total-counts[0]-counts[1]-counts[2];
      const classes=['l1','l2','l3','l4'],colors=['#f3b98f','#9fbdfb','#3974f7','#7854c7'];document.querySelector('#performanceComposition').innerHTML=counts.map((count,index)=>`<i class="${classes[index]}" style="width:${count/total*100}%"></i>`).join('');document.querySelector('#performanceDistribution').innerHTML=counts.map((count,index)=>`<div class="distribution-row"><span>${index===3?'Level 4+':`Level ${index+1}`}</span><div class="mini-track"><i style="width:${count/total*100}%;background:${colors[index]}"></i></div><b>${count} · ${Math.round(count/total*100)}%</b></div>`).join('');
    };
    [performancePeriod,classSelect,subjectSelect].forEach(select=>select.addEventListener('change',updatePerformance));updatePerformance();
    document.addEventListener('click',event=>{if(!picker.hidden&&!picker.contains(event.target)&&event.target!==performancePeriod&&!performancePeriod.closest('.select-wrap')?.contains(event.target))picker.hidden=true});
  }

  const period = document.querySelector('#teacherResultsPeriod');
  if (!period) return;
  [...period.options].filter(option=>/school term|school year/i.test(option.textContent)).forEach(option=>option.remove());
  period.parentElement.querySelector('.ds-select')?.remove();if(window.EXAI_ENHANCE_SELECTS)window.EXAI_ENHANCE_SELECTS();else enhanceLateSelect(period);

  const periodData = {
    '90': ['42 <span>of 60</span>', 'Active in the previous 90 days', '286', '79%', '8', 'Next deadline: 28 Aug 2026'],
    term: ['55 <span>of 60</span>', 'Active this school term', '684', '83%', '8', 'Next deadline: 28 Aug 2026'],
    year: ['59 <span>of 60</span>', 'Active this school year', '1,842', '86%', '8', 'Next deadline: 28 Aug 2026'],
    custom: ['31 <span>of 60</span>', 'Active from 10–24 Aug 2026', '128', '72%', '5', 'Next deadline: 28 Aug 2026']
  };
  const updatePeriod = () => {
    const d = periodData[period.value];
    document.querySelector('[data-kpi="active"]').innerHTML = d[0];
    document.querySelector('[data-kpi-note="active"]').textContent = d[1];
    document.querySelector('[data-kpi="submissions"]').textContent = d[2];
    document.querySelector('[data-kpi="completion"]').textContent = d[3];
    document.querySelector('[data-kpi="open"]').textContent = d[4];
    document.querySelector('[data-kpi-note="open"]').textContent = d[5];
    document.querySelector('#teacherCalendar').hidden = period.value !== 'custom';
  };
  period.addEventListener('change', updatePeriod); updatePeriod();
  document.addEventListener('click',event=>{const picker=document.querySelector('#teacherCalendar');if(!picker?.hidden&&!picker.contains(event.target)&&event.target!==period&&!period.closest('.select-wrap')?.contains(event.target))picker.hidden=true});

  const calendar = document.querySelector('#teacherCalendarGrid'); let selectedDays = [];
  calendar.innerHTML = ['S','M','T','W','T','F','S', ...Array.from({length:31}, (_,i)=>i+1)].map((day,index) => index < 7 ? `<b>${day}</b>` : `<button data-day="${day}">${day}</button>`).join('');
  calendar.addEventListener('click', event => {
    const button = event.target.closest('[data-day]'); if (!button) return;
    if (selectedDays.length === 2) selectedDays = [];
    selectedDays.push(Number(button.dataset.day));
    calendar.querySelectorAll('button').forEach(dayButton => {
      const day = Number(dayButton.dataset.day);
      dayButton.classList.toggle('range', selectedDays.length === 2 && day >= Math.min(...selectedDays) && day <= Math.max(...selectedDays));
      dayButton.classList.toggle('edge', selectedDays.includes(day));
    });
    if (selectedDays.length === 2) {
      const label=`${Math.min(...selectedDays)}–${Math.max(...selectedDays)} Aug 2026`;period.options[period.options.length-1].text = label;period.closest('.select-wrap')?.querySelector('.ds-select-button>span:first-child')?.replaceChildren(label);
      setTimeout(() => { document.querySelector('#teacherCalendar').hidden = true; }, 350);
    }
  });

  const givenNames = ['Ava','Ethan','Mia','Noah','Sophie','Lucas','Chloe','Ryan','Emma','Oscar','Grace','Leo','Zoe','Jayden','Ella'];
  const familyNames = ['Lau','Wong','Chan','Lee'];
  const names = familyNames.flatMap((family, familyIndex) => givenNames.map((given, givenIndex) => ({
    name: `${given} ${family}`,
    id: `ST${26001 + familyIndex * givenNames.length + givenIndex}`
  })));
  const openBatches = [
    ['DSE English Reading','English','60 students','3 classes',18,60,'28 Aug 2026','Due in 2 days'],
    ['Math S4 · Algebra','Math','20 students','Class 1A',18,20,'29 Aug 2026','Due in 3 days'],
    ['English Listening','English','20 students','Class 1B',13,20,'31 Aug 2026','Due in 5 days'],
    ['Screening Assessment','English','60 students','3 classes',47,60,'2 Sep 2026','Due in 7 days'],
    ['Math S4 · Geometry','Math','20 students','Class 2A',8,20,'5 Sep 2026','Due in 10 days'],
    ['English Grammar','English','20 students','Class 1A',6,20,'8 Sep 2026','Due in 13 days'],
    ['Math S4 · Statistics','Math','20 students','Class 1B',0,20,'9 Sep 2026','Due in 14 days'],
    ['DSE English Writing','English','60 students','3 classes',0,60,'9 Sep 2026','Due in 14 days']
  ];
  const closedBatches = Array.from({length:38}, (_,i) => [`${i%2?'Math':'English'} Assessment · ${String(i+1).padStart(2,'0')}`, i%2?'Math':'English', i%3?'20 students':'60 students', i%3?['Class 1A','Class 1B','Class 2A'][i%3]:'3 classes', 16+(i%5), 20, `${25-i%20} Jul 2026`, 'Closed']);
  const rows = document.querySelector('#teacherBatchRows'); const search = document.querySelector('#teacherBatchSearch'); const subject = document.querySelector('#teacherBatchSubject'); const classFilter = document.querySelector('#teacherBatchClass');
  let state = 'open'; let page = 1; let currentBatch;

  const showStudents = kind => {
    const total = currentBatch[5];
    const done = Math.min(currentBatch[4], total);
    const progressing = state === 'open' ? Math.min(2, total - done) : 0;
    const groups = {
      completed: names.slice(0, done),
      progress: names.slice(done, done + progressing),
      missing: names.slice(done + progressing, total)
    };
    const list = document.querySelector('#drawerStudents');
    const reviewTarget = currentBatch[1] === 'Math'
      ? 'practice-player/?mode=assessment&pack=math-s4&review=result&viewer=teacher'
      : `assessment-player/?review=result&pack=${currentBatch[0].includes('Listening')?'english-listening':'dse-reading'}&viewer=teacher`;
    list.innerHTML = (groups[kind] || []).map((student,index) => `<article class="student-result-row" ${kind==='completed'?`data-href="${reviewTarget}" tabindex="0"`:'aria-disabled="true"'}><div><strong>${student.name}</strong><small>${student.id} · ${currentBatch[3]}</small></div><span class="score">${kind==='completed'?`${68+(index*7)%27}%`:'—'}</span><span class="state">${kind==='completed'?'RESULT AVAILABLE':kind==='progress'?'IN PROGRESS':'NOT SUBMITTED'}</span></article>`).join('') || '<p class="batch-empty">No students in this group.</p>';
    list.querySelectorAll('[data-href]').forEach(item => item.addEventListener('click', () => { location.href = item.dataset.href; }));
  };
  const openDrawer = batch => {
    currentBatch = batch;
    document.querySelector('#drawerBatchTitle').textContent = batch[0];
    document.querySelector('#drawerBatchMeta').textContent = `${batch[1]} · ${batch[2]} · Deadline ${batch[6]}`;
    const done = Math.min(batch[4], batch[5]);
    const progressing = state === 'open' ? Math.min(2, batch[5] - done) : 0;
    const counts = {completed: done, progress: progressing, missing: batch[5] - done - progressing};
    const completion = Math.round(done / batch[5] * 100);
    const average = batch[1] === 'Math' ? 72 + (done % 7) : 76 + (done % 6);
    document.querySelector('#drawerAverage').textContent = `${average}%`;
    document.querySelector('#drawerCompletion').textContent = `${done} of ${batch[5]} · ${completion}%`;
    document.querySelector('#drawerCompletionBar').style.width = `${completion}%`;
    document.querySelector('#drawerTime').textContent = batch[1] === 'Math' ? '34 min' : '47 min';
    const skills = batch[1] === 'Math'
      ? [['Algebra',average+5],['Number',average-2],['Geometry',average-8]]
      : [['Reading',average+7],['Grammar',average-5],['Vocabulary',average+1],['Listening',average-2]];
    document.querySelector('#drawerSkills').innerHTML = skills.map(([skill,score]) => `<div class="batch-skill-row"><span>${skill}</span><div class="mini-track"><i style="width:${Math.max(0,Math.min(100,score))}%"></i></div><b>${score}%</b></div>`).join('');
    document.querySelectorAll('[data-student-state]').forEach(button => {
      button.querySelector('span').textContent = counts[button.dataset.studentState];
    });
    document.querySelector('[data-student-state].active')?.classList.remove('active');
    document.querySelector('[data-student-state="completed"]').classList.add('active');
    document.querySelector('#batchDrawer').classList.add('open'); showStudents('completed');
  };
  const renderBatches = () => {
    let batches = (state === 'open' ? openBatches : closedBatches).filter(batch => (subject.value === 'all' || batch[1] === subject.value) && (classFilter.value === 'all' || batch[3] === classFilter.value || batch[3] === '3 classes') && batch[0].toLowerCase().includes(search.value.toLowerCase()));
    const pages = Math.max(1, Math.ceil(batches.length/10)); page = Math.min(page,pages); const shown = state === 'open' ? batches : batches.slice((page-1)*10,page*10);
    rows.innerHTML = shown.map((batch,index) => `<tr data-index="${index}"><td><span class="assessment-title-cell"><strong>${batch[0]}</strong><span class="status-pill ${state==='closed'?'complete':''}">${state==='open'?'OPEN':'CLOSED'}</span></span></td><td>${batch[1]}</td><td><span class="assigned-count"><strong>${batch[2]}</strong><small>${batch[3]}</small></span></td><td class="progress-cell"><div class="progress-label"><b>${batch[4]}/${batch[5]}</b><span>${Math.round(batch[4]/batch[5]*100)}%</span></div><div class="mini-track"><i style="width:${batch[4]/batch[5]*100}%"></i></div></td><td class="deadline-cell">${batch[6]}<small>${batch[7]}</small></td></tr>`).join('');
    rows.querySelectorAll('tr').forEach((row,index) => row.addEventListener('click', () => openDrawer(shown[index])));
    document.querySelector('#teacherBatchCount').textContent = `Showing ${shown.length} of ${batches.length} ${state} assessments`;
    document.querySelector('#teacherBatchPage').innerHTML = `<button data-page="prev" ${page===1?'disabled':''}>Previous</button><span>Page ${page} of ${pages}</span><button data-page="next" ${page===pages?'disabled':''}>Next</button>`;
  };
  document.querySelectorAll('[data-batch-state]').forEach(button => button.addEventListener('click', () => { document.querySelector('[data-batch-state].active')?.classList.remove('active'); button.classList.add('active'); state=button.dataset.batchState; page=1; renderBatches(); }));
  document.querySelectorAll('[data-student-state]').forEach(button => button.addEventListener('click', () => { document.querySelector('[data-student-state].active')?.classList.remove('active'); button.classList.add('active'); showStudents(button.dataset.studentState); }));
  document.querySelector('.drawer-close').addEventListener('click', () => document.querySelector('#batchDrawer').classList.remove('open'));
  document.querySelector('#batchDrawer').addEventListener('click', event => { if (event.target.id === 'batchDrawer') event.currentTarget.classList.remove('open'); });
  [search,subject,classFilter].forEach(control => control.addEventListener(control===search?'input':'change', renderBatches));
  document.querySelector('#teacherBatchPage').addEventListener('click', event => { const button=event.target.closest('[data-page]'); if(!button)return; page=Math.max(1,page+(button.dataset.page==='next'?1:-1)); renderBatches(); });
  renderBatches();
});

addEventListener('DOMContentLoaded',()=>{
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const upgrade=(picker,period)=>{
    if(!picker||!period||picker.dataset.upgraded)return;picker.dataset.upgraded='true';let month=7,year=2026,picks=[];
    picker.innerHTML='<div class="calendar-nav"><button type="button" data-shift="-1" aria-label="Previous month">‹</button><label><span>Month</span><select data-month></select></label><label><span>Year</span><select data-year></select></label><button type="button" data-shift="1" aria-label="Next month">›</button></div><p>Select start and end dates</p><div class="calendar-grid"></div>';
    const monthSelect=picker.querySelector('[data-month]'),yearSelect=picker.querySelector('[data-year]'),grid=picker.querySelector('.calendar-grid');monthSelect.innerHTML=months.map((name,index)=>`<option value="${index}">${name}</option>`).join('');yearSelect.innerHTML=Array.from({length:9},(_,index)=>2022+index).map(value=>`<option>${value}</option>`).join('');
    const render=()=>{monthSelect.value=month;yearSelect.value=year;const blanks=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();grid.innerHTML=['S','M','T','W','T','F','S'].map(day=>`<b>${day}</b>`).join('')+Array.from({length:blanks},()=>'<span></span>').join('')+Array.from({length:days},(_,index)=>`<button type="button" data-day="${index+1}">${index+1}</button>`).join('')};
    const show=()=>picker.hidden=false;picker.addEventListener('click',event=>{const shift=event.target.closest('[data-shift]');if(shift){month+=Number(shift.dataset.shift);if(month<0){month=11;year--}if(month>11){month=0;year++}picks=[];render();return}const button=event.target.closest('[data-day]');if(!button)return;if(picks.length===2)picks=[];picks.push(Number(button.dataset.day));grid.querySelectorAll('[data-day]').forEach(node=>{const day=Number(node.dataset.day);node.classList.toggle('range',picks.length===2&&day>=Math.min(...picks)&&day<=Math.max(...picks));node.classList.toggle('edge',picks.includes(day))});if(picks.length===2){const label=`${Math.min(...picks)}–${Math.max(...picks)} ${months[month].slice(0,3)} ${year}`,option=[...period.options].find(item=>item.value==='custom'||item.value==='Custom range')||period.options[period.options.length-1];option.text=label;period.closest('.select-wrap')?.querySelector('.ds-select-button>span:first-child')?.replaceChildren(label);setTimeout(()=>picker.hidden=true,250)}});
    monthSelect.onchange=()=>{month=Number(monthSelect.value);picks=[];render()};yearSelect.onchange=()=>{year=Number(yearSelect.value);picks=[];render()};period.addEventListener('change',()=>{if(period.value==='custom'||period.value==='Custom range')show()});period.closest('.select-wrap')?.addEventListener('click',event=>{if(event.target.closest('.ds-select-option')&&(event.target.textContent.includes('Custom')||/\d+–\d+/.test(event.target.textContent)))setTimeout(show,0)});render();
  };
  upgrade(document.querySelector('#teacherCalendar'),document.querySelector('#teacherResultsPeriod'));upgrade(document.querySelector('.performance-calendar'),document.querySelector('#teacherPerformancePeriod'));
});

addEventListener('DOMContentLoaded',()=>{
  const host=document.querySelector('.teacher-student-insight');if(!host)return;
  const data={english:{topics:[['Grammar',44],['Writing',68],['Vocabulary',73],['Reading',83]],missing:['Text-based reading','Summary writing']},math:{topics:[['Arc lengths and areas of sectors',23],['Coordinate geometry',56],['Trigonometry',61],['Polygons',73],['Pythagoras’ theorem',73],['Statistics and dispersion',79]],missing:['Probability','Similarity and congruence','Linear inequalities']}};
  const status=value=>value<60?'Needs practice':value<75?'Developing':'Strong',summary=(name,value)=>value<60?`${name} is the clearest opportunity in the current evidence. Review the underlying concepts and monitor the next scored set.`:value<75?`${name} is developing. More consistent application should improve the student’s result.`:`${name} is currently secure. Maintain it while prioritising lower-scoring topics.`;
  const areas=(name,value)=>[['Mistake pattern analysis',value<60?'The scored responses suggest an inconsistent approach. Review question-level work to identify the recurring misconception.':'No consistent mistake pattern can be confirmed from the aggregate score alone.'],['Skill mastery analysis',`Current topic mastery is ${value}%. ${value<60?'The available evidence points to a foundational gap.':value<75?'Understanding is developing, with room to improve consistency.':'Performance is secure across the scored work available.'}`],['Areas to strengthen',value<75?`Revisit the core ideas within ${name} and check the reasoning used before an answer is selected or submitted.`:`Maintain ${name} through short mixed review while prioritising lower-scoring topics.`],['Teaching suggestion',value<75?'Use one worked example followed by a short independent check, then compare errors by concept.':'Use spaced retrieval and one mixed transfer question to retain mastery.'],['Next evidence to review',value<75?`Review the next scored ${name} responses to see whether the same difficulty appears again.`:`Check whether ${name} remains secure when combined with a developing topic.`]];
  const render=subject=>{const set=data[subject]||data.english;host.className='teacher-topic-insight';host.innerHTML=`<header><span class="teacher-ai-badge">AI</span><div><h2>AI performance insight by topic</h2><p>Open a topic to review the analysis behind this student’s evaluation.</p></div><span class="teacher-mastery-help">How mastery works <i>i</i><span>Topic mastery is the percentage of scored questions answered correctly for this student. Needs practice is below 60%, Developing is 60–74%, and Strong is 75% or above.</span></span></header><div class="teacher-topic-list">${set.topics.map(([name,value],index)=>`<article class="teacher-topic-row ${index===0?'expanded':''}"><button type="button" aria-expanded="${index===0}"><span><small>${index===0?'PRIORITY TOPIC':'TOPIC'}</small><b>${name}</b><span>${summary(name,value)}</span></span><span class="teacher-topic-score"><em class="${value<60?'needs':value<75?'developing':'strong'}">${status(value)}</em><strong>${value}%</strong><i></i></span></button><div class="teacher-topic-detail"><div>${areas(name,value).map(([title,body])=>`<section><h3>${title}</h3><p>${body}</p></section>`).join('')}</div><small>Based on the student’s scored questions in the selected subject and period.</small></div></article>`).join('')}</div><details class="teacher-insufficient"><summary><span><i>i</i><b>${set.missing.length} topics need more evidence</b></span><i class="teacher-insufficient-chevron"></i></summary><div><p>More scored responses are needed before a reliable topic insight can be shown:</p><ul>${set.missing.map(name=>`<li><span><b>${name}</b><small>Not enough scored questions yet</small></span></li>`).join('')}</ul></div></details>`;host.querySelectorAll('.teacher-topic-row>button').forEach(button=>button.onclick=()=>{const row=button.closest('.teacher-topic-row'),open=!row.classList.contains('expanded');host.querySelectorAll('.teacher-topic-row').forEach(item=>{item.classList.remove('expanded');item.querySelector('button').setAttribute('aria-expanded','false')});if(open){row.classList.add('expanded');button.setAttribute('aria-expanded','true')}})};
  const subject=document.querySelector('.teacher-subject-select select');render(subject?.value||'english');subject?.addEventListener('change',event=>render(event.target.value));
});

// Fixture rows are rendered after DOMContentLoaded; re-apply stable-ID/view-model
// bindings without coupling this page to persistence table names.
addEventListener('DOMContentLoaded',()=>[0,100,500].forEach(delay=>setTimeout(()=>window.EXAI_SCREEN_BINDINGS?.mount(),delay)));
