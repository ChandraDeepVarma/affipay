import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
const mngstf = [
  { username: "Wade Warren", role: "Team Lead",accountstatus:"Active" },
  { username: "Kathryn Murphy", role: "Manager",accountstatus:"Inactive"  },
  { username: "Wade Warren", role: "Team Lead",accountstatus:"Active" },
  { username: "Wade Warren", role: "Team Lead" ,accountstatus:"Active" },
  { username: "Wade Warren", role: "Team Lead",accountstatus:"Inactive" },
  { username: "Savannah Nguyen", role: "HR Executive",accountstatus:"Active"  },
  { username: "Wade Warren", role: "Team Lead",accountstatus:"Inactive" },
  { username: "Darlene Robertson", role: "Senior Developer",accountstatus:"Active"  },
  { username: "Wade Warren", role: "Team Lead",accountstatus:"Inactive" },
  { username: "Cameron Williamson", role: "UI/UX Designer",accountstatus:"Active"  },
  { username: "Wade Warren", role: "Team Lead",accountstatus:"Active" }
];
import { TbRestore } from "react-icons/tb";
const StaffManagement = () => {
  return (
    <div className='card h-100 p-0 radius-12'>
      <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between'>
        <div className='d-flex align-items-center flex-wrap gap-3'>
          <form className='navbar-search'>
            <input
              type='text'
              className='bg-base h-40-px w-auto'
              name='search'
              placeholder='Search'
            />
            <Icon icon='ion:search-outline' className='icon' />
          </form>
        </div>
      </div>
      <div className='card-body p-24'>
        <div className='table-responsive scroll-sm'>
          <table className='table bordered-table sm-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Role</th>
                <th scope='col'>Account Status</th>
                <th scope='col' className='text-center'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mngstf.map((user, idx) => (
                <tr key={idx}>
                  <td>
                    <span
                      className={`px-10 py-2 radius-4 fw-medium text-xs`}
                    >
                      {user.username}
                    </span>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={ 
                        user.accountstatus === "Active"
                          ? "px-10 py-2 radius-4 fw-medium text-xs bg-success-focus text-success-600 border-0"
                          : "px-10 py-2 radius-4 fw-medium text-xs bg-danger-focus text-danger-600 border-0"
                      }
                    >
                      {user.accountstatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex align-items-center gap-10 justify-content-center">
                     <button
                        type="button"
                        className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle" 
                       >
                        <Icon icon="majesticons:eye-line" className="icon text-xl" />
                      </button>
                      <button
                        type="button"
                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                      >
                        <Icon icon="lucide:edit" className="menu-icon" />
                      </button>
                      <button
                        type="button"
                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        >
                        <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                      </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24'>
          <span>Showing 1 to 10 of 12 entries</span>
          <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>
            <li className='page-item'>
              <Link
                className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md'
                href='#'
              >
                <Icon icon='ep:d-arrow-left' className='' />
              </Link>
            </li>
            {[1,2,3,4,5].map((num) => (
              <li className='page-item' key={num}>
                <Link
                  className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${num === 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light'}`}
                  href='#'
                >
                  {num}
                </Link>
              </li>
            ))}
            <li className='page-item'>
              <Link
                className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md'
                href='#'
              >
                {" "}
                <Icon icon='ep:d-arrow-right' className='' />{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};


export default StaffManagement;
