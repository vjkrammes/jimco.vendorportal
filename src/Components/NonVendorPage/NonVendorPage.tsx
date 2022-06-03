import './NonVendorPage.css';

export default function NonVendorPage() {
  return (
    <div className="container">
      <div className="header">
        <div className="heading">Access Restricted to JimCo Vendors</div>
      </div>
      <div className="content" id="nvp__messages">
        <p>
          This site is intended solely for the use of JimCo Retailers Vendors
          and their employees.
        </p>
        <p>
          Access to this site by non-vendors, even if they are employed by JimCo
          Retailers, is prohibited.
        </p>
      </div>
    </div>
  );
}
