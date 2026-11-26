import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Check, Plus, Sun, Moon, MapPin, Settings, Trash2, Clock3, Bell, Sunrise, Sunset } from 'lucide-react';

type Task = { id: string; title: string; done: boolean };
const sampleTimes = [
  ['עלות השחר','05:02',Sunrise], ['סוף זמן שמע · מג״א','08:31',Sun],
  ['סוף זמן שמע · גר״א','09:07',Sun], ['חצות היום','11:42',Sun],
  ['מנחה גדולה','12:13',Clock3], ['שקיעה','16:42',Sunset], ['צאת הכוכבים','17:08',Moon]
] as const;
const hebrew = (d: Date) => new Intl.DateTimeFormat('he-IL-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric'}).format(d);
const gregorian = (d: Date) => new Intl.DateTimeFormat('he-IL',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);

export default function App() {
 const [date,setDate] = useState(new Date());
 const [dark,setDark] = useState(()=>localStorage.getItem('jc.theme')!=='light');
 const [city,setCity] = useState(()=>localStorage.getItem('jc.city')||'ירושלים');
 const [tasks,setTasks] = useState<Task[]>(()=>{try{return JSON.parse(localStorage.getItem('jc.tasks')||'[]')}catch{return []}});
 const [draft,setDraft] = useState('');
 const [tab,setTab] = useState<'day'|'tasks'|'calendar'>('day');
 const [settings,setSettings] = useState(false);
 const [allTimes,setAllTimes] = useState(false);
 const [now,setNow] = useState(new Date());
 useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
 useEffect(()=>localStorage.setItem('jc.tasks',JSON.stringify(tasks)),[tasks]);
 useEffect(()=>localStorage.setItem('jc.theme',dark?'dark':'light'),[dark]);
 useEffect(()=>localStorage.setItem('jc.city',city),[city]);
 const isToday = date.toDateString()===new Date().toDateString();
 const dateHeb = useMemo(()=>hebrew(date),[date]);
 const addTask=()=>{if(!draft.trim())return;setTasks(v=>[...v,{id:crypto.randomUUID(),title:draft.trim(),done:false}]);setDraft('')};
 const shift=(n:number)=>setDate(v=>{const d=new Date(v);d.setDate(d.getDate()+n);return d});
 return <div className={dark?'app dark':'app light'}>
  <aside className="sidebar"><div className="brand"><span className="brandIcon"><CalendarDays/></span><div><b>לוח יהודי</b><small>הזמן שלך, בסדר שלך</small></div></div><p className="navLabel">תפריט ראשי</p>
   <button className={tab==='day'?'nav active':'nav'} onClick={()=>setTab('day')}><Sun/> היום</button>
   <button className={tab==='calendar'?'nav active':'nav'} onClick={()=>setTab('calendar')}><CalendarDays/> לוח שנה</button>
   <button className={tab==='tasks'?'nav active':'nav'} onClick={()=>setTab('tasks')}><Check/> משימות ותזכורות <span className="count">{tasks.filter(t=>!t.done).length}</span></button>
   <div className="sideBottom"><div className="location"><MapPin/><div><small>מיקום פעיל</small><b>{city}</b></div><button onClick={()=>setSettings(true)} aria-label="הגדרות"><Settings/></button></div><small>מצב אורח · נשמר במכשיר זה</small></div>
  </aside>
  <main><header><span>לוח יהודי　/　{tab==='day'?'היום':tab==='tasks'?'משימות':'לוח שנה'}</span><div><button className="iconBtn" onClick={()=>setDark(v=>!v)} aria-label="החלפת ערכת נושא">{dark?<Sun/>:<Moon/>}</button><button className="settingsBtn" onClick={()=>setSettings(true)}><Settings/> הגדרות</button></div></header>
   <div className="content"><div className="welcome"><div><small>{isToday?'יום טוב ומבורך':'תצוגת יום'}</small><h1>{isToday?'היום שלך':gregorian(date)}</h1><p>{dateHeb} · {gregorian(date)}</p></div><div className="dateNav"><button onClick={()=>shift(1)} aria-label="יום הבא"><ChevronRight/></button><button onClick={()=>setDate(new Date())}>היום</button><button onClick={()=>shift(-1)} aria-label="יום קודם"><ChevronLeft/></button></div></div>
   {tab==='day'&&<><section className="hero"><div className="heroTop"><span>● סדר היום</span><small>{dateHeb}</small></div><div className="heroMain"><div><small>השעה כעת</small><strong>{now.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})}</strong><p>השקיעה היום · נתון הדגמה בלבד</p></div><div className="sunGraphic">☀</div></div><div className="heroFoot"><span>מיקום · {city}</span><span>זמני היום יוצגו לאחר חיבור מנוע הלכתי</span></div></section>
   <div className="sectionHead"><div><h2>זמני היום</h2><small>נתוני המחשה בלבד — אינם לשימוש הלכתי</small></div><button onClick={()=>setAllTimes(v=>!v)}>{allTimes?'הצג פחות':'כל הזמנים'} ←</button></div>
   <div className="times">{(allTimes?sampleTimes:sampleTimes.filter((_,i)=>[1,2,3,5].includes(i))).map(([label,time,Icon])=><div className="timeCard" key={label}><Icon/><div><small>{label}</small><b>{time}</b></div></div>)}</div>
   <div className="panels"><section className="panel"><div className="panelHead"><div><h2>המשימות שלי</h2><small>{tasks.filter(t=>t.done).length} מתוך {tasks.length} הושלמו</small></div><button onClick={()=>setTab('tasks')}>לכל המשימות ←</button></div>{tasks.slice(0,4).map(t=><button className="task" key={t.id} onClick={()=>setTasks(v=>v.map(x=>x.id===t.id?{...x,done:!x.done}:x))}><span className={t.done?'check checked':'check'}>{t.done?'✓':''}</span><span>{t.title}</span></button>)}{!tasks.length&&<p className="muted">עדיין אין משימות. אפשר להוסיף משימה חדשה.</p>}</section><section className="panel reminder"><Bell/><h2>התזכורת הבאה</h2><p>תזכורות מערכת יתווספו בשלב הבא, לאחר חיבור מנגנון ההתראות.</p></section></div></>}
   {tab==='tasks'&&<section className="panel taskPanel"><h2>משימות ותזכורות</h2><small>המשימות נשמרות בדפדפן הנוכחי בלבד</small><div className="addRow"><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="מה צריך לזכור?"/><button onClick={addTask}><Plus/> הוסף</button></div>{tasks.map(t=><div className="task fullTask" key={t.id}><button onClick={()=>setTasks(v=>v.map(x=>x.id===t.id?{...x,done:!x.done}:x))}><span className={t.done?'check checked':'check'}>{t.done?'✓':''}</span><span className={t.done?'strike':''}>{t.title}</span></button><button className="delete" onClick={()=>setTasks(v=>v.filter(x=>x.id!==t.id))} aria-label="מחיקה"><Trash2/></button></div>)}</section>}
   {tab==='calendar'&&<section className="panel calendarPanel"><CalendarDays/><h2>לוח השנה היהודי</h2><p>בשלב הבא יתווספו פרשות, חגים, ראשי חודשים, ספירת העומר, ימי זיכרון ותצוגת חודש מלאה.</p><button onClick={()=>setTab('day')}>חזרה להיום</button></section>}
   <footer>גרסת פיתוח 0.3 · נבנה בהדרגה, בדגש על דיוק ופשטות</footer></div>
  </main>
  {settings&&<div className="overlay" onClick={()=>setSettings(false)}><section className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSettings(false)}>×</button><h2>הגדרות</h2><label>עיר לחישוב זמני היום<input value={city} onChange={e=>setCity(e.target.value)} placeholder="לדוגמה: ירושלים"/></label><p>הזמנים כרגע להמחשה בלבד. בחירת שיטת חישוב, אזור זמן והתראות תתווסף עם מנוע הזמנים.</p><button className="primary" onClick={()=>setSettings(false)}>שמירה</button></section></div>}
 </div>;
}
