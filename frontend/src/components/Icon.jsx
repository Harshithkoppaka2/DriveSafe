const paths = {
  dashboard: '<path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z"/>',
  car: '<path d="m5 11 1.6-4.3A2.5 2.5 0 0 1 9 5h6a2.5 2.5 0 0 1 2.4 1.7L19 11m-14 0h14a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2Zm1 6v2m12-2v2M7 14h.01M17 14h.01"/>',
  rental: '<path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 8h3m2 0h3m-8 4h3m2 0h3"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z"/>',
  inspect: '<path d="M9 4H6a2 2 0 0 0-2 2v14h16V6a2 2 0 0 0-2-2h-3M9 3h6v4H9V3Zm0 9 2 2 4-4m-6 8h6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-2-11.96a4 4 0 0 1 0 7.75"/>',
  settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6.5-1.4 1.4M7.4 16.6 6 18m12-0.1-1.4-1.4M7.4 7.4 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<path d="m21 21-4.3-4.3m2.3-5.2A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 13h4"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  logout: '<path d="M10 17l5-5-5-5m5 5H3m10-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  alert: '<path d="M12 9v4m0 4h.01M10.3 3.7 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/>',
  clock: '<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v5l3 2"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  mileage: '<path d="M4 17a8 8 0 1 1 16 0M12 17l4-6M6 17h12"/>',
  camera: '<path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v10H2V9a2 2 0 0 1 2-2Zm8 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>',
  calendar: '<path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/>',
  dots: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
  shield: '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Zm-3-10 2 2 4-4"/>'
}

export default function Icon({ name, size = 18, className = '' }) {
  const path = paths[name] || paths.dashboard
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: path }} />
}
