import { ORDER_FLOW, ORDER_LABELS, type OrderStatus } from "../../shared/marketplace";

export function Stepper({ status }: { status: OrderStatus }) {
  const current = ORDER_FLOW.indexOf(status);
  return (
    <ol className="stepper">
      {ORDER_FLOW.map((step, index) => {
        const state = index < current ? "done" : index === current ? "now" : "later";
        return (
          <li key={step} className={state}>
            <span>{index + 1}</span>
            <strong>{ORDER_LABELS[step]}</strong>
          </li>
        );
      })}
    </ol>
  );
}

export function WorkflowMap() {
  return (
    <ol className="workflow">
      <li>
        <span>1</span>
        <div>
          <strong>Waiting for payment confirmation</strong>
          <p>The buyer submits the order. The seller has not confirmed payment yet.</p>
        </div>
      </li>
      <li>
        <span>2</span>
        <div>
          <strong>Payment Confirmed</strong>
          <p>The seller marks Payment Received. Waiting for payment stays on the order until then.</p>
        </div>
      </li>
      <li>
        <span>3</span>
        <div>
          <strong>Ready to ship</strong>
          <p>The seller moves the order forward and prepares the product.</p>
        </div>
      </li>
      <li>
        <span>4</span>
        <div>
          <strong>Shipped</strong>
          <p>The seller confirms shipment. The buyer can follow it from order history.</p>
        </div>
      </li>
      <li>
        <span>5</span>
        <div>
          <strong>Completed</strong>
          <p>The buyer confirms the goods arrived. The platform admin only monitors this trail.</p>
        </div>
      </li>
    </ol>
  );
}
