import { projects } from './projects';
import { researchAreas } from './research';
import { notes } from './notes';
export const pageGroups = [
  { title: 'Home', links: [ { label: 'Dawnlight', href: '/', detail: 'Opening, research preview, short project highlights, principles and closing identity.' }, { label: 'Project highlights', href: '/#work', detail: 'Short introductions linking to each project overview.' } ] },
  { title: 'Research', links: [ { label: 'Research overview', href: '/research', detail: 'Research fields and approach.' }, ...researchAreas.map(area=>({label:area.title, href:'/research#'+area.art, detail:area.detail})), { label:'Research programs', href:'/research/programs', detail:'Draft structure and program-scope placeholders. Excluded from indexing.' } ] },
  { title: 'Projects', links: [ { label:'All projects', href:'/projects', detail:'Full interactive showcases.' }, ...projects.map(project=>({label:project.name,href:'/projects/'+project.slug,detail:project.type+'; overview, interactive illustration, approach and related projects.'})) ] },
  { title: 'Publications & Notes', links: [ { label:'Archive', href:'/notes', detail:'Draft preview: research papers, technical articles and field notes. Excluded from indexing.' }, {label:'Research papers',href:'/notes#research-papers',detail:'Draft paper previews.'}, {label:'Technical articles',href:'/notes#technical-articles',detail:'Draft engineering articles.'}, {label:'Field notes',href:'/notes#field-notes',detail:'Draft experiments and design notes.'}, ...notes.map(note=>({label:note.title,href:'/notes/'+note.slug,detail:note.kind+'; placeholder article, publication context and related reading. Excluded from indexing.'})) ] },
  { title: 'Company', links: [ {label:'About',href:'/about',detail:'Laboratory, principles and founders.'}, {label:'Founders',href:'/about#people-title',detail:'Amaan Syed and Sairaj Jawalikar; email, GitHub and LinkedIn links.'}, {label:'Contact',href:'/contact',detail:'General email and copy-address action.'}, {label:'Questions',href:'/faq',detail:'Project availability, illustration behavior, contact and privacy.'} ] },
  { title: 'Information', links: [ {label:'Privacy policy',href:'/privacy',detail:'Hosting, analytics, contact and data handling.'}, {label:'Terms and conditions',href:'/terms',detail:'Website terms, intellectual property and limitations.'}, {label:'Site map',href:'/site-map',detail:'This human-readable review directory.'}, {label:'404 preview',href:'/404',detail:'Missing-page design and routes back to the website. Excluded from indexing.'} ] },
];
export const futurePages = [
  {path:'/updates',purpose:'News and meaningful company or project announcements.'},
  {path:'/open-source',purpose:'Released repositories, licenses and contribution links.'},
  {path:'/careers',purpose:'Real roles and application information when hiring.'},
  {path:'/press',purpose:'Approved descriptions, downloadable brand assets and media contact.'},
  {path:'/security',purpose:'Responsible disclosure and substantiated product security information.'},
];
