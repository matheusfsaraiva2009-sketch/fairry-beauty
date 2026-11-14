import { redirect } from "next/navigation";

// Registro de novos usuários está desabilitado.
// Apenas o administrador pode acessar o sistema.
export default function RegistroPage() {
  redirect("/login");
}
