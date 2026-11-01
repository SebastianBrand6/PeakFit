const formatCOP = (price) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(price);

export default function PricingPlans({ gym }) {
  return (
    <section className="panel pricing-panel" aria-labelledby="pricing-title">
      <div className="panel-heading compact-heading">
        <div>
          <p className="eyebrow">ENTRENA CON {gym.brand.toUpperCase()}</p>
          <h2 id="pricing-title">Planes y precios</h2>
        </div>
        <span className="price-period">COP / mes</span>
      </div>

      {gym.plans.length > 0 ? (
        <div className="plan-list">
          {gym.plans.map((plan) => (
            <article className="plan-card" key={plan.name}>
              <div className="plan-topline">
                <h3>{plan.name}</h3>
              </div>
              <p className="plan-detail">{plan.description}</p>
              <p className="plan-price">{formatCOP(plan.priceCOP)}<span> / mes</span></p>
              {plan.features.length > 0 && (
                <ul className="plan-features">
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="pricing-disclaimer">No hay planes disponibles para esta sede.</p>
      )}
      <p className="pricing-disclaimer">
        Precios de referencia. Consulta condiciones y tarifas vigentes con cada gimnasio.
      </p>
    </section>
  );
}
