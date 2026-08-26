addEventListener('DOMContentLoaded', () => {
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

  const performancePeriod = document.querySelector('#teacherPerformancePeriod');
  if (performancePeriod) {
    const controls = performancePeriod.closest('.teacher-controls'); controls.style.position = 'relative';
    const picker = document.createElement('div'); picker.className = 'calendar-popover'; picker.hidden = true;
    picker.innerHTML = '<div class="calendar-head"><b>August 2026</b><span>Select start and end dates</span></div><div class="calendar-grid"></div>';
    controls.append(picker); const grid = picker.querySelector('.calendar-grid'); let picks = [];
    grid.innerHTML = ['S','M','T','W','T','F','S', ...Array.from({length:31}, (_,i)=>i+1)].map((day,index)=>index<7?`<b>${day}</b>`:`<button data-day="${day}">${day}</button>`).join('');
    performancePeriod.addEventListener('change',()=>{picker.hidden=performancePeriod.value!=='Custom range'});
    grid.addEventListener('click',event=>{const button=event.target.closest('[data-day]');if(!button)return;if(picks.length===2)picks=[];picks.push(Number(button.dataset.day));grid.querySelectorAll('button').forEach(dayButton=>{const day=Number(dayButton.dataset.day);dayButton.classList.toggle('range',picks.length===2&&day>=Math.min(...picks)&&day<=Math.max(...picks));dayButton.classList.toggle('edge',picks.includes(day))});if(picks.length===2){performancePeriod.options[3].text=`${Math.min(...picks)}–${Math.max(...picks)} Aug 2026`;setTimeout(()=>{picker.hidden=true},350)}});
    const classSelect=document.querySelector('#teacherPerformanceClass'),subjectSelect=document.querySelector('#teacherPerformanceSubject');
    const updatePerformance=()=>{
      const all=classSelect.selectedIndex===0,total=all?60:20,periodFactor=[1,.96,1.04,.91][performancePeriod.selectedIndex]||1,subjectOffset=subjectSelect.selectedIndex?3:0;
      const active=Math.min(total,Math.round(total*(all ? .9 : .88)*periodFactor)),completion=Math.min(98,Math.round(82*periodFactor)+subjectOffset),average=Math.min(95,Math.round(73*periodFactor)+subjectOffset);
      const values={students:total,active,completion:`${completion}%`,average:`${average}%`};document.querySelectorAll('[data-performance-kpi]').forEach(node=>node.textContent=values[node.dataset.performanceKpi]);
      const ratios=subjectSelect.selectedIndex?[.15,.3,.45,.1]:[.22,.37,.38,.03],counts=ratios.map((ratio,index)=>index===3?0:Math.round(total*ratio));counts[3]=total-counts[0]-counts[1]-counts[2];
      const classes=['l1','l2','l3','l4'],colors=['#f3b98f','#9fbdfb','#3974f7','#7854c7'];document.querySelector('#performanceComposition').innerHTML=counts.map((count,index)=>`<i class="${classes[index]}" style="width:${count/total*100}%"></i>`).join('');document.querySelector('#performanceDistribution').innerHTML=counts.map((count,index)=>`<div class="distribution-row"><span>${index===3?'Level 4+':`Level ${index+1}`}</span><div class="mini-track"><i style="width:${count/total*100}%;background:${colors[index]}"></i></div><b>${count} · ${Math.round(count/total*100)}%</b></div>`).join('');
    };
    [performancePeriod,classSelect,subjectSelect].forEach(select=>select.addEventListener('change',updatePerformance));updatePerformance();
  }

  const period = document.querySelector('#teacherResultsPeriod');
  if (!period) return;

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
      period.options[3].text = `${Math.min(...selectedDays)}–${Math.max(...selectedDays)} Aug 2026`;
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
