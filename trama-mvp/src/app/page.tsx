import { redirect } from "next/navigation";

// "/" entra directamente en el panel de la marca de demo.
export default function Inicio() {
  redirect("/panel");
}
