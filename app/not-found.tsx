import ErrorPage from '@/components/ui/error';

export default function NotFound() {
  return (
    <ErrorPage
      title="Página no encontrada"
      message="Lo sentimos, la página que buscas no existe o ha sido movida."
      actionText="🏠 Ir al Inicio"
      actionHref="/"
    />
  );
}
