import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import SidebarLinkGroup from './SidebarLinkGroup';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                  <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                  <stop stopColor="#A5B4FC" offset="100%" />
                </linearGradient>
                <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                  <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                  <stop stopColor="#38BDF8" offset="100%" />
                </linearGradient>
              </defs>
              <rect fill="#6366F1" width="32" height="32" rx="16" />
              <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
              <path
                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                fill="url(#logo-a)"
              />
              <path
                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                fill="url(#logo-b)"
              />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('inbox') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('dashboard') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path
                        className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'
                          }`}
                        d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                      />
                      <path
                        className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'
                          }`}
                        d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                      />
                      <path
                        className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                      />
                    </svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                  </div>
                </NavLink>
              </li>
              {/* Income */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('inbox') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/income"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('inbox') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6 text-slate-500" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <g> <g> <path d="m420.1,359.1h-19.8-12.5c-43.8,0-80.2,35.4-80.2,79.2v45.8c0,0 41.7,16.7 95.8,16.7 46.9,0 96.9-15.6 96.9-15.6v-46.9c-5.68434e-14-43.8-36.5-79.2-80.2-79.2zm59.4,111.5c-13.5,3.1-43.8,10.4-76,10.4-37.5,0-64.6-7.3-76-10.4h1v-31.3c0-33.3 26-59.4 59.4-59.4h32.3c32.3,0 59.4,27.1 59.4,59.4v31.3z"></path> <path d="m350.8,297c0,28.1 24,52.1 53.1,52.1s53.1-24 53.1-52.1c0-28.1-24-52.1-53.1-52.1s-53.1,23-53.1,52.1zm85.4,0c0,17.7-14.6,32.3-32.3,32.3s-32.3-14.6-32.3-32.3 14.6-32.3 32.3-32.3c17.7,0.1 32.3,13.6 32.3,32.3z"></path> <path d="m123.2,360.2h-32.3c-43.8,0-80.2,35.4-79.2,79.2v45.8c0,0 41.7,15.6 95.8,15.6 45.8,0 95.8-15.6 95.8-15.6v-45.8c0.1-43.8-36.4-79.2-80.1-79.2zm60.4,110.4c-13.5,3.1-43.8,10.4-76,10.4-37.5,0-64.6-7.3-76-10.4v-31.3c0-33.3 26-59.4 59.4-59.4h33.3c32.3,0 59.4,27.1 59.4,59.4v31.3z"></path> <path d="m107.6,349.1c29.2,0 53.1-24 53.1-52.1 0-28.1-24-52.1-53.1-52.1-29.2,0-53.1,22.9-53.1,52.1-0.1,28.2 23.9,52.1 53.1,52.1zm0-84.3c18.8,0 33.3,13.5 32.3,32.3 0,17.7-14.6,32.3-32.3,32.3-17.7,0-32.3-14.6-32.3-32.3s14.5-32.3 32.3-32.3z"></path> <path d="M415.9,11.2H94v210.4h321.9V11.2z M396.1,200.8H114.9V32h281.3V200.8z"></path> <path d="m225.3,135.2l-15.6,18.8c11.5,10.4 25,16.7 38.5,18.8v11.5h17.7v-11.5c10.4-2.1 19.8-5.2 25-10.4 6.3-6.3 9.4-13.5 9.4-22.9 0-9.4-3.1-16.7-8.3-21.9-5.2-5.2-14.6-9.4-26-12.5v-24.1c6.3,1 12.5,4.2 19.8,9.4l13.5-19.8c-11.5-7.3-21.9-12.5-33.3-13.5v-8.3h-18.8v10.4c-9.4,1-17.7,4.2-24,10.4-6.3,6.3-9.4,13.5-9.4,22.9s3.1,16.7 8.3,21.9c6.3,4.2 14.6,8.3 26,11.5v24c-6.2-2.2-14.5-7.4-22.8-14.7zm40.6-5.2c3.1,1 5.2,3.1 6.3,4.2 1,1 2.1,3.1 2.1,5.2 0,5.2-2.1,8.3-8.3,10.4v-19.8zm-25.1-40.7c0-5.2 2.1-7.3 7.3-9.4v19.8c-5.2-3.1-7.3-6.2-7.3-10.4z"></path> </g> </g> </g></svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Income</span>
                  </div>
                </NavLink>
              </li>
              {/* Goals */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('campaigns') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/goals"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('campaigns') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path
                        className={`fill-current ${pathname.includes('campaigns') ? 'text-indigo-500' : 'text-slate-600'}`}
                        d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                      />
                      <path
                        className={`fill-current ${pathname.includes('campaigns') ? 'text-indigo-300' : 'text-slate-400'}`}
                        d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                      />
                    </svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Goals
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Expenses */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('campaigns') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/expenses"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('campaigns') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M215.284,237.206c-0.611,8.092-7.634,14.046-15.725,13.435c-2.595-0.153-4.428-1.069-6.718-2.137 c0,0-41.527-28.244-43.97-30.229c-4.122-3.511-8.244-7.634-10.076-13.588c-0.611-2.137-9.008-30.687-9.008-30.687L126.017,254 H41.746l2.036-32.214H23.832C11.771,221.786,2,212.015,2,199.954c0-2.901,0.458-5.649,1.527-8.092c0,0,22.596-50.687,26.871-58.932 c6.26-12.367,17.252-17.71,32.672-17.252h40.764L18.489,176.9l-7.634,17.863c-0.763,1.527-1.069,3.359-1.069,5.191 c0,7.634,6.26,13.893,13.893,13.893h70.993c12.061,0,21.832-9.771,21.832-21.832c0-10.687-7.634-19.695-17.71-21.527l20.763-55.115 h4.886c11.45,0,20.458,7.786,23.054,16.641l16.336,58.932c0.305,0.916,1.374,2.748,2.748,3.817 c1.679,1.221,43.054,29.619,43.054,29.619C213.452,227.282,215.742,232.015,215.284,237.206z M89.94,105.602 c17.863,1.374,33.435-11.908,34.809-29.771c1.374-17.863-11.908-33.435-29.771-34.809S61.542,52.93,60.168,70.792 C58.794,88.655,72.077,104.228,89.94,105.602z M108.566,191.862c0-7.176-5.496-12.977-12.367-13.741l-10.076,27.787l8.55-0.153 C102.306,205.755,108.566,199.496,108.566,191.862z M205,100c26.964,0,49-21.891,49-49S232.109,2,205,2 s-48.855,22.036-48.855,49.145C156.145,78.109,178.036,100,205,100z M202.294,55.156c-8.988-3.141-14.594-7.683-14.594-15.753 c0-7.442,4.929-13.289,13.965-15.125v-8.07h6.765v7.683c5.606,0,9.665,1.16,12.661,2.754l-2.754,9.665 c-2.223-0.918-5.847-2.464-10.824-2.464c-4.977,0-7.683,2.464-7.683,4.929c0,3.383,3.141,4.687,9.906,7.442 c9.23,3.383,13.531,8.07,13.531,15.753s-4.687,13.531-14.594,15.753v7.683h-6.765v-7.442c-5.847,0-11.743-1.546-14.594-3.141 l2.464-9.906c3.141,1.546,8.07,3.383,13.289,3.383c5.606,0,8.36-2.465,8.36-5.847S208.769,57.669,202.294,55.156z"></path> </g></svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Expenses
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
