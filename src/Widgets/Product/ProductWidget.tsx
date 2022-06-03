import { MdCancel, MdEdit, MdCheck } from 'react-icons/md';
import { IProduct } from '../../Interfaces/IProduct';
import { toCurrency } from '../../Services/tools';
import { getHex } from '../../Services/ColorService';
import AgeBadge from '../Badges/AgeBadge';
import './ProductWidget.css';

type Props = {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDiscontinue: (product: IProduct) => void;
};

export default function ProductWidget({
  product,
  onEdit,
  onDiscontinue,
}: Props) {
  return (
    <div
      className="pw__container"
      style={{ backgroundColor: getHex(product.category!.background) }}
    >
      {product && (
        <>
          <div className="pw__line">
            <div
              className="pw__name pw__stretch"
              style={
                product.discontinued
                  ? { textDecoration: 'line-through', color: 'var(--gray3)' }
                  : undefined
              }
            >
              {product.name}
            </div>
            <AgeBadge age={product.ageRequired} prefix="pw__ab" />
            <div className="pw__rightalign" title="List Price">
              {toCurrency(product.price)}
            </div>
          </div>
          <div className="pw__line">
            <div className="pw__description pw__stretch">
              {product.description}
            </div>
            <div className="pw__rightalign pw__italics" title="Cost">
              {toCurrency(product.cost)}
            </div>
          </div>
          <div className="pw__line3">
            <label className="pw__catlabel pw__label">Category:</label>
            <div className="pw__catvalue">{product.category!.name}</div>
            <label className="pw__skulabel pw__label">SKU:</label>
            <div className="pw__skuvalue">{product.sku}</div>
          </div>
          <div className="pw__line4">
            <label className="pw__islabel pw__label">In Stock:</label>
            <div
              className="pw__isvalue"
              style={
                product.quantity > product.reorderLevel
                  ? { color: 'var(--green3)' }
                  : { color: 'var(--yellow3)' }
              }
            >
              {product.quantity}
            </div>
            <label className="pw__rllabel pw__label">Reorder&nbsp;Level:</label>
            <div className="pw__rlvalue">{product.reorderLevel}</div>
            <label className="pw__ralabel pw__label">Amount:</label>
            <div className="pw__ravalue">{product.reorderAmount}</div>
            <div className="buttoncontainer pw__buttons">
              <button
                className="squarebutton"
                type="button"
                onClick={() => onEdit(product)}
                title="Edit this product"
              >
                <MdEdit />
              </button>
              <button
                className="squarebutton"
                type="button"
                onClick={() => onDiscontinue(product)}
                title="Toggle discontinued status"
              >
                {product.discontinued && <MdCheck />}
                {!product.discontinued && <MdCancel />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
