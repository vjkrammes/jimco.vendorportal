import {
  useEffect,
  useState,
  FormEvent,
  useCallback,
  ChangeEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../Contexts/UserContext';
import { useAlert } from '../../Contexts/AlertContext';
import {
  MdArrowLeft,
  MdArrowRight,
  MdSearch,
  MdSave,
  MdCancel,
  MdClear,
  MdInfo,
} from 'react-icons/md';
import { FaStickyNote } from 'react-icons/fa';
import { GrContactInfo } from 'react-icons/gr';
import { IProduct } from '../../Interfaces/IProduct';
import { IVendor } from '../../Interfaces/IVendor';
import { IVendorProductUpdate } from '../../Interfaces/IVendorProductUpdate';
import { IApiResponse } from '../../Interfaces/IApiResponse';
import { getProducts, updateProduct } from '../../Services/ProductService';
import { discontinueProduct } from '../../Services/ProductService';
import { updateVendor } from '../../Services/VendorService';
import HideWidget from '../../Widgets/Hide/HideWidget';
import Pager from '../../Widgets/Pager/Pager';
import ProductWidget from '../../Widgets/Product/ProductWidget';
import Spinner from '../../Widgets/Spinner/Spinner';
import './MainPage.css';

type Props = {
  itemsPerPage: number;
};

type SearchData = {
  search: string;
};

type DemoData = {
  id: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  contact: string;
  email: string;
  phone: string;
  fax: string;
};

export default function MainPage({ itemsPerPage }: Props) {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [reorderAmount, setReorderAmount] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [highestPage, setHighestPage] = useState<number>(1);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { vendor, isValid, isVendor } = useUser();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const modal = document.getElementById('mp__modal');
  const {
    register: searchRegister,
    handleSubmit: handleSearchSubmit,
    reset: searchReset,
    watch: searchWatch,
  } = useForm<SearchData>({
    mode: 'onBlur',
    defaultValues: {
      search: '',
    },
  });
  const {
    register: demoRegister,
    handleSubmit: handleDemoSubmit,
    reset: demoReset,
    watch: demoWatch,
  } = useForm<DemoData>({
    mode: 'onBlur',
    defaultValues: {
      id: vendor?.id,
      name: vendor?.name,
      address1: vendor?.address1,
      address2: vendor?.address2,
      city: vendor?.city,
      state: vendor?.state,
      postalCode: vendor?.postalCode,
      contact: vendor?.contact,
      email: vendor?.email,
      phone: vendor?.phone,
      fax: vendor?.fax,
    },
  });
  const resetDemo = useCallback(() => {
    demoReset({
      id: vendor?.id,
      name: vendor?.name,
      address1: vendor?.address1,
      address2: vendor?.address2,
      city: vendor?.city,
      state: vendor?.state,
      postalCode: vendor?.postalCode,
      contact: vendor?.contact,
      email: vendor?.email,
      phone: vendor?.phone,
      fax: vendor?.fax,
    });
  }, [vendor, demoReset]);
  const doLoadProducts = useCallback(async () => {
    setLoading(true);
    if (vendor) {
      const prods = await getProducts(vendor.id);
      setAllProducts(prods);
      setLoading(false);
      setCurrentPage(1);
      resetDemo();
    }
  }, [vendor, resetDemo]);
  useEffect(() => {
    if (!isAuthenticated || (isValid && !isVendor)) {
      navigate('/NonVendor');
    }
  }, [isAuthenticated, isVendor, navigate, isValid]);
  useEffect(() => {
    setLoading(true);
    doLoadProducts();
    setCurrentPage(1);
    setPageSize(itemsPerPage <= 0 ? 5 : itemsPerPage > 10 ? 10 : itemsPerPage);
    setHighestPage(Math.ceil(allProducts.length / pageSize));
  }, [itemsPerPage, pageSize, allProducts.length, doLoadProducts]);
  useEffect(() => {
    const offset = (currentPage - 1) * pageSize;
    setProducts(allProducts.slice(offset, offset + pageSize));
  }, [allProducts, pageSize, currentPage]);
  async function doSaveDemo(data: DemoData) {
    if (!demoWatch('name') || !demoWatch('contact')) {
      setAlert('Name and Contact are required information', 'error', 5000);
      return;
    }
    const newvendor: IVendor = {
      ...data,
      hasVendorRole: vendor!.hasVendorRole,
      userExists: vendor!.userExists,
    };
    const result = await updateVendor(
      newvendor,
      await getAccessTokenSilently(),
    );
    if (result.ok) {
      setAlert(
        'Profile changes complete. Please reload the page to see the changes',
        'success',
      );
      return;
    }
    const apiresult = result.body as IApiResponse;
    if (apiresult.message) {
      setAlert(apiresult.message, 'error', 5000);
      return;
    }
    setAlert(`An unexpected error occurred (${result.code})`, 'error', 5000);
  }
  function pageChanged(newPage: number) {
    if (newPage >= 1 && newPage <= highestPage) {
      setCurrentPage(newPage);
    }
  }
  function doSearch(data: SearchData) {
    if (allProducts && data && data.search) {
      const match = allProducts.find(
        (x) =>
          x.name.toLowerCase().indexOf(data.search.toLowerCase()) >= 0 ||
          x.description
            .toLowerCase()
            .indexOf(data.search.toLocaleLowerCase()) >= 0,
      );
      if (match) {
        const ix = allProducts.findIndex((x) => x.id === match.id);
        if (ix >= 0) {
          setCurrentPage(Math.floor(ix / pageSize) + 1);
          return;
        }
      }
    }
    setAlert('No Matching Products Found', 'warning', 5000);
  }
  function resetSearch() {
    searchReset({
      search: '',
    });
    setCurrentPage(1);
  }
  async function doDiscontinue(product: IProduct) {
    if (product) {
      const oldstatus = product.discontinued;
      const result = await discontinueProduct(
        vendor!.email,
        product.id,
        await getAccessTokenSilently(),
      );
      if (
        result.code === 0 &&
        !result.message &&
        (!result.messages || result.messages.length === 0)
      ) {
        await doLoadProducts();
        setAlert(
          oldstatus ? 'Product no longer discontinued' : 'Product discontinued',
          'success',
        );
        return;
      }
      setAlert(result.message, 'error', 5000);
    }
  }
  function editClick(product: IProduct) {
    if (product) {
      setSelectedProduct(product);
      setReorderAmount(product.reorderAmount);
      setCost(product.cost);
      // @ts-ignore
      modal.showModal();
    }
  }
  function reorderAmountChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.currentTarget && e.currentTarget.value) {
      setReorderAmount(Number(e.currentTarget.value));
    } else {
      setReorderAmount(0);
    }
  }
  function costChanged(e: ChangeEvent<HTMLInputElement>) {
    if (e && e.currentTarget && e.currentTarget.value) {
      setCost(Number(e.currentTarget.value));
    } else {
      setCost(0);
    }
  }
  function isInteger(value: number): boolean {
    return Number(value) === value && value % 1 === 0;
  }
  async function doEdit() {
    if (reorderAmount < 0) {
      setErrorMessage('Reorder Amount must be greater than or equal to zero');
      return;
    }
    if (!isInteger(reorderAmount)) {
      setErrorMessage('Reorder Amount must be a whole number');
      return;
    }
    if (reorderAmount > 25) {
      setErrorMessage(
        'Contact Vendor support for reorder amounts in excess of 25 units',
      );
      return;
    }
    if (cost <= 0) {
      setErrorMessage('Cost must be a value greater than zero');
      return;
    }
    if (cost > selectedProduct!.price * 0.75) {
      setErrorMessage(
        'Cost exceeds 75% of our list price. Contact Vendor support',
      );
      return;
    }
    const update: IVendorProductUpdate = {
      id: selectedProduct!.id,
      reorderAmount: reorderAmount,
      cost: cost,
    };
    const response = await updateProduct(
      update,
      await getAccessTokenSilently(),
    );
    // @ts-ignore
    modal.close();
    if (
      response.code === 0 &&
      !response.message &&
      (!response.messages || response.messages.length === 0)
    ) {
      await doLoadProducts();
      setAlert('Product updated successfully', 'success');
      return;
    }
    setAlert(response.message, 'error', 5000);
  }
  function cancelEdit() {
    setSelectedProduct(null);
    setErrorMessage(null);
    // @ts-ignore
    modal.close();
  }
  return (
    <div className="container">
      {/* Edit Product cost and reorder level dialog */}
      <dialog className="modal" id="mp__modal">
        <div className="mp__em__container">
          <div className="mp__em__heading">Edit Product Data</div>
          <div className="mp__em__body">
            <div className="formitem">
              <label className="formlabel" htmlFor="name">
                Name
              </label>
              <div className="forminput mp__em__bold" id="name">
                {selectedProduct?.name}
              </div>
            </div>
            <div className="formitem">
              <label
                className="formlabel mp__em__label"
                htmlFor="reorderAmount"
              >
                Reorder Amount
              </label>
              <input
                className="forminput"
                type="number"
                id="reorderAmount"
                value={reorderAmount}
                onChange={reorderAmountChanged}
                placeholder="Reorder Amount"
                min={0}
                step={1}
              />
            </div>
            <div className="formitem">
              <label className="formlabel mp__em__label" htmlFor="cost">
                Cost
              </label>
              <input
                className="forminput"
                type="number"
                id="cost"
                value={cost}
                onChange={costChanged}
                placeholder="Cost"
                min={0.01}
                step={0.01}
              />
            </div>
            <div className="mp__em__error">{errorMessage}</div>
            <div className="mp__em__notice">
              <span className="mp__em__bold">Note:</span>&nbsp; To change any
              other product information, please contact JimCo Vendor Support.
            </div>
            <div className="buttoncontainer">
              <button className="primarybutton" type="submit" onClick={doEdit}>
                <span>
                  <MdSave /> Save
                </span>
              </button>
              <button
                className="secondarybutton"
                type="button"
                onClick={cancelEdit}
              >
                <span>
                  <MdCancel /> Cancel
                </span>
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <div className="header">
        <div className="heading">{vendor?.name}</div>
        <button
          className="primarybutton headerbutton-left"
          type="button"
          onClick={() => navigate('/Notices')}
        >
          <span>
            <FaStickyNote /> Notices
          </span>
        </button>
      </div>
      <div className="content">
        <div className="mp__demographics">
          <HideWidget
            label="Demo"
            content={
              <div className="mp__democontent">
                <GrContactInfo /> Edit your Demographic data
              </div>
            }
            initialState="closed"
          >
            {!vendor && (
              <div className="mp__nodemo">No Demographic Data Available</div>
            )}
            {vendor && (
              <form
                className="mp__demoform"
                onSubmit={handleDemoSubmit(doSaveDemo)}
              >
                <div className="mp__df__heading">Demographic Data</div>
                <input type="hidden" {...demoRegister('id')} />
                <div className="formitem">
                  <label className="formlabel" htmlFor="name">
                    Name<span className="redstar">*</span>
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="name"
                    {...demoRegister('name')}
                    placeholder="Name"
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="address1">
                    Address
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="address1"
                    {...demoRegister('address1')}
                    placeholder="Address Line 1"
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="address2">
                    &nbsp;
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="address2"
                    {...demoRegister('address2')}
                    placeholder="Address Line 2"
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="city">
                    City
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="city"
                    {...demoRegister('city')}
                    placeholder="City"
                  />
                  <label className="formlabel shortformlabel" htmlFor="state">
                    State
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="state"
                    {...demoRegister('state')}
                    placeholder="State"
                  />
                  <label className="formlabel shortformlabel" htmlFor="zip">
                    ZIP
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    {...demoRegister('postalCode')}
                    placeholder="Postal Code"
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="contact">
                    Contact<span className="redstar">*</span>
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="contact"
                    {...demoRegister('contact')}
                    placeholder="Contact"
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="email">
                    Email
                    <span
                      className="mp__df__info"
                      title="Please contact support to change your email address"
                    >
                      <MdInfo />
                    </span>
                  </label>
                  <input
                    className="forminput"
                    type="email"
                    id="email"
                    {...demoRegister('email')}
                    placeholder="Email"
                    disabled={true}
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="phone"
                    {...demoRegister('phone')}
                    placeholder="Phone"
                  />
                </div>
                <div className="formitem">
                  <label className="formlabel" htmlFor="fax">
                    Fax
                  </label>
                  <input
                    className="forminput"
                    type="text"
                    id="fax"
                    {...demoRegister('fax')}
                    placeholder="Fax"
                  />
                </div>
                <div className="buttoncontainer">
                  <button
                    className="primarybutton"
                    type="submit"
                    disabled={
                      !demoWatch('name') ||
                      !demoWatch('contact') ||
                      !demoWatch('email')
                    }
                  >
                    <span>
                      <MdSave /> Save
                    </span>
                  </button>
                  <button className="secondarybutton" onClick={resetDemo}>
                    <span>
                      <MdClear /> Reset
                    </span>
                  </button>
                </div>
              </form>
            )}
          </HideWidget>
        </div>
        <div className="mo__products">
          {loading && (
            <div className="loading">
              <Spinner /> Loading...{' '}
            </div>
          )}
          {!loading && allProducts && allProducts.length === 0 && (
            <div className="noitemsfound">No Products Found</div>
          )}
          {!loading && allProducts && allProducts.length > 0 && (
            <div className="mp__body">
              <Pager
                numItems={allProducts.length}
                itemsPerPage={pageSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                prevButtonContent={
                  <span className="mp__pagerbuttoncontent">
                    <MdArrowLeft /> Prev
                  </span>
                }
                nextButtonContent={
                  <span className="mp__pagerbuttoncontent">
                    <span>
                      Next <MdArrowRight />
                    </span>
                  </span>
                }
                onPageChanged={pageChanged}
                showPages={true}
                onReset={() => doLoadProducts()}
              >
                <div className="mp__pagercontent">
                  <div className="mp__pc__name">Products</div>
                  <div className="mp__pc__form">
                    <form
                      className="mp__pc__form"
                      onSubmit={handleSearchSubmit(doSearch)}
                    >
                      <input
                        className="mp__pc__f__input"
                        type="search"
                        {...searchRegister('search')}
                        onInput={(e: FormEvent<HTMLInputElement>) => {
                          if (!e.currentTarget.value) {
                            resetSearch();
                          }
                        }}
                        placeholder="Search by name or description"
                      />
                      <button
                        type="submit"
                        className="squarebutton"
                        disabled={!searchWatch('search')}
                      >
                        <MdSearch />
                      </button>
                      <button
                        type="button"
                        className="squarebutton"
                        onClick={resetSearch}
                        title="Reset Search"
                      >
                        <MdCancel />
                      </button>
                    </form>
                  </div>
                </div>
              </Pager>
              <div className="mp__productlist">
                {products.map((x) => (
                  <div className="mp__productitem" key={x.id}>
                    <ProductWidget
                      product={x}
                      onEdit={editClick}
                      onDiscontinue={doDiscontinue}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
