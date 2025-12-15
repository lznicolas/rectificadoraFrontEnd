import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonasTabs from "../pages/PersonasTabs";

const mockClientes = [
  { id: 1, nombre: "Ana", apellido: "Lopez", dni: "123", tipoCliente: "EMPRESA" },
];
const mockEmpleados = [
  {
    id: 2,
    nombre: "Luis",
    apellido: "Diaz",
    dni: "456",
    especialidad: "RECTIFICADOR",
    sueldo: 1000,
  },
];

const eliminarCliente = vi.fn().mockResolvedValue({});
const eliminarEmpleado = vi.fn().mockResolvedValue({});
const obtenerClientes = vi.fn().mockResolvedValue(mockClientes);
const obtenerEmpleados = vi.fn().mockResolvedValue(mockEmpleados);

vi.mock("../services/api", () => ({
  obtenerClientes,
  obtenerEmpleados,
  eliminarCliente,
  eliminarEmpleado,
}));

describe("PersonasTabs delete confirmation", () => {
  beforeEach(() => {
    eliminarCliente.mockClear();
    eliminarEmpleado.mockClear();
    obtenerClientes.mockClear();
    obtenerEmpleados.mockClear();
    window.alert = vi.fn();
  });

  it("pregunta confirmación antes de eliminar un cliente", async () => {
    render(<PersonasTabs />);

    const clienteCell = await screen.findByText("Ana");
    const clienteRow = clienteCell.closest("tr");
    const deleteBtn = within(clienteRow).getByRole("button", { name: /eliminar/i });

    await userEvent.click(deleteBtn);
    expect(
      screen.getByText(/¿Eliminar este cliente\?/i)
    ).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /^Eliminar$/i }));

    await waitFor(() => expect(eliminarCliente).toHaveBeenCalledWith(1));
  });

  it("pregunta confirmación antes de eliminar un empleado", async () => {
    render(<PersonasTabs />);

    const empleadosTab = screen.getByRole("tab", { name: /Empleados/i });
    await userEvent.click(empleadosTab);

    const empleadoCell = await screen.findByText("Luis");
    const empleadoRow = empleadoCell.closest("tr");
    const deleteBtn = within(empleadoRow).getByRole("button", { name: /eliminar/i });

    await userEvent.click(deleteBtn);
    expect(
      screen.getByText(/¿Eliminar este empleado\?/i)
    ).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /^Eliminar$/i }));

    await waitFor(() => expect(eliminarEmpleado).toHaveBeenCalledWith(2));
  });
});
