import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => (
  <div className="auth-layout">
    <aside className="auth-intro">
      <span className="eyebrow">TU ESPACIO FINANCIERO</span>
      <h1>Tus cuentas.<br />Todo en un lugar.</h1>
      <p>Consulta tus saldos, organiza tus cuentas y sigue cada movimiento desde un mismo panel.</p>
      <div className="auth-features">
        <div><span aria-hidden="true">01</span><p><strong>Una vista clara</strong>El saldo y el estado de tus cuentas, a la mano.</p></div>
        <div><span aria-hidden="true">02</span><p><strong>Movimientos sencillos</strong>Depósitos, retiros y transferencias desde tu panel.</p></div>
        <div><span aria-hidden="true">03</span><p><strong>Tu historial disponible</strong>Consulta los movimientos de cada cuenta.</p></div>
      </div>
      <span className="auth-intro-footer">FINTECH CORE / CUENTAS DIGITALES</span>
    </aside>
    <section className="page-card auth-form-card">
      <span className="eyebrow">BIENVENIDO A FINTECH CORE</span>
      <h2>{title}</h2>
      <p className="auth-description">{description}</p>
      {children}
    </section>
  </div>
);
