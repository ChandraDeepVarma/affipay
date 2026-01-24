import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
const pkgplan = [
  { username: "kumar", subscrplan: "Basic", startdate: "04 Jul 2025", enddate: "05 Jul 2025", status: "Active" },
  { username: "priya", subscrplan: "Premium", startdate: "01 Jun 2025", enddate: "30 Jun 2025", status: "Expired" },
  { username: "arun", subscrplan: "Standard", startdate: "10 Jul 2025", enddate: "15 Jul 2025", status: "Active" },
  { username: "meena", subscrplan: "Basic", startdate: "20 May 2025", enddate: "25 May 2025", status: "Expired" },
  { username: "vijay", subscrplan: "Premium", startdate: "01 Aug 2025", enddate: "31 Aug 2025", status: "Active" }

];
const SimplePricingPlan = () => {
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
                <th scope='col'>User Name</th>
                <th scope='col'>Subsciption Type</th>
                <th scope='col'>Subsciption Start Date</th>
                <th scope='col'>Subsciption End Date</th>
                <th scope='col'>Subscription Status</th>
              </tr>
            </thead>
            <tbody>
              {pkgplan.map((typekg, idx) => (
                <tr key={idx}>
                  <td>
                    <span
                      className={`px-10 py-2 radius-4 fw-medium text-xs`}
                    >
                      {typekg.username}
                    </span>
                  </td>
                  <td>{typekg.subscrplan}</td>
                  <td>{typekg.startdate}</td>
                  <td>{typekg.enddate}</td>
                  <td>
                   <span
                      className={`px-10 py-2 radius-4 fw-medium text-xs border ${typekg.status === 'Expired' ? 'bg-danger-200 text-danger-600 border-0' : 'bg-success-focus text-success-600 border-success-main'}`}
                    >
                     {typekg.status}
                    </span>
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

export default SimplePricingPlan;
