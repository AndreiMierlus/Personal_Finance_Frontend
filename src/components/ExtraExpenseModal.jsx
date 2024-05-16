import React, { useRef, useEffect, useState } from 'react';
import Transition from '../utils/Transition';
import { useSelector, useDispatch } from 'react-redux';

function ExtraExpenseModal({ modalOpen, setModalOpen, value }) {
  const modalContent = useRef(null);
  // close on click outside
  //   useEffect(() => {
  //     const clickHandler = ({ target }) => {
  //       if (!modalOpen || modalContent.current.contains(target)) return;
  //       setModalOpen(false);
  //     };
  //     document.addEventListener('click', clickHandler);
  //     return () => document.removeEventListener('click', clickHandler);
  //   });

  const dispatch = useDispatch();

  const handleDeleteExpense = (id) => {
    if (valueType === 'expense') {
      dispatch(deleteExpense(id));
    } else {
      dispatch(deleteIncome(id));
    }
  };

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-70 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        className="fixed inset-0 z-50 overflow-hidden flex items-center top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 overflow-auto max-w-2xl w-full max-h-full rounded shadow-lg p-5"
        >
          <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2 flex items-center justify-between">
            <div>Name</div>
            <div>Value</div>
          </header>
          <ul className="my-1">
            {/* Item */}
            {value?.length > 0 ? (
              value?.map((item, index) => {
                return (
                  <li className="flex px-2">
                    <div className="w-9 h-9 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                      <svg className="w-9 h-9 fill-current text-rose-50" viewBox="0 0 36 36">
                        <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
                      </svg>
                    </div>
                    <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
                      <div className="grow flex justify-between">
                        <div className="self-center">
                          <a
                            className="font-medium text-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-white"
                            href="#0"
                          ></a>
                          {item?.other_expense[index]?.expense_name}
                        </div>
                        <div className="flex items-center ml-2">
                          <span className="font-medium text-red-600">
                            -{`${item?.other_expense[index]?.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-center">No Data</p>
            )}
          </ul>
          <button
            onClick={() => setModalOpen(false)}
            className="w-full py-2 border border-gray-700 rounded-md mt-2"
          >
            Close
          </button>
        </div>
      </Transition>
    </>
  );
}

export default ExtraExpenseModal;
