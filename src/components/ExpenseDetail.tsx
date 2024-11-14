import { useMemo } from "react";
import { formatDate } from "../helpers";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import { Expense } from "../types";
import AmountDisplay from "./AmountDisplay";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";
import "react-swipeable-list/dist/styles.css";

type ExpenseDetailProps = {
  expense: Expense;
};

export default function ExpenseDetail({ expense }: ExpenseDetailProps) {
  const { dispatch } = useBudget();

  const categoryInfo = useMemo(
    () => categories.find((cat) => cat.id === expense.category),
    [expense]
  );

  // Acción de la derecha (actualizar)
  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction
        onClick={() =>
          dispatch({ type: "get-expense-by-id", payload: { id: expense.id } })
        }
      >
        Actualizar
      </SwipeAction>
    </LeadingActions>
  );

  // Acción de la izquierda (eliminar)
  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        onClick={() =>
          dispatch({ type: "remove-expense", payload: { id: expense.id } })
        }
        destructive={true}
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList fullSwipe={false}>
      <SwipeableListItem
        maxSwipe={1}
        leadingActions={leadingActions()} // Deslizar a la derecha para actualizar
        trailingActions={trailingActions()} // Deslizar a la izquierda para eliminar
      >
        <div className="bg-white shadow-lg p-5 w-full border-b border-s-gray-200 flex gap items-center">
          <div>
            {categoryInfo ? (
              <img
                src={`/icono_${categoryInfo.icon}.svg`}
                alt="Icono Gasto"
                className="w-20"
              />
            ) : (
              <p>Icono no disponible</p>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-sm font-bold uppercase text-slate-500">
              {categoryInfo ? categoryInfo.name : "Categoría no encontrada"}
            </p>
            <p>{expense.expenseName}</p>
            <p className="text-slate-600 text-sm">
            {expense.date ? formatDate(new Date(expense.date).toISOString()) : "Fecha no disponible"}
            </p>
          </div>

          <AmountDisplay amount={expense.amount} />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  );
}
