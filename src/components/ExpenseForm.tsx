import { categories } from "../data/categories";
import DatePicker from 'react-datepicker';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css'
import './css/ExpenseForm.css'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: '',
    category: '',
    date: new Date()
  })

  const [error, setError] = useState('')
  const [previousAmount, setPreviousAmount] = useState(0)
  const { dispatch, state, remainingBudget } = useBudget()

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
      setExpense(editingExpense)
      setPreviousAmount(editingExpense.amount)
    }
  }, [state.editingId])

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: Array.isArray(value) ? value[0] : value, // Assign the first element if it's an array
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    const isAmountField = ['amount'].includes(name)
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value

    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //validar
    if (Object.values(expense).includes('')) {
      setError('Todos los campos son obligatorios')
      return
    }

    //validar que no me pase del limite
    if ((expense.amount - previousAmount)  > remainingBudget ) {
      setError('Rebasa el presupuesto')
      return
    }

    //agregar nuevo gasto o actualizar 
    if (state.editingId) {
      dispatch({
        type: 'update-expense',
        payload: {
          expense: { id: state.editingId, ...expense }
        }
      });
    } else {

      dispatch({ type: 'add-expense', payload: { expense } })
    }

    //reiniciar el state
    setExpense({
      amount: 0,
      expenseName: '',
      category: '',
      date: new Date()
    })
    setPreviousAmount(0)
  }


  return (
    <form action="" className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
      </legend>

      {error && <ErrorMessage >{error}</ErrorMessage>}

      <div className="flex flex-col">

        <label
          htmlFor="expenseName"
          className="text-xl"

        >Nombre Gasto:</label>
        <input
          type="text"
          id='expenseName'
          placeholder="Nombre del gasto o consumo"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}

        />
      </div>

      <div className="flex flex-col">

        <label
          htmlFor="amount"
          className="text-xl"

        >Cantidad:</label>
        <input
          type="number"
          id='amount'
          placeholder="Añade la cantidad del gasto"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}

        />
      </div>

      <div className="flex flex-col">

        <label
          htmlFor="category"
          className="text-xl"

        >Categoria:</label>
        <select
          id='category'
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- Seleccione --</option>
          {categories.map(category => (
            <option
              value={category.id}
              key={category.id}
            > {category.name}</option>
          ))}
        </select>

        <div className="flex flex-col">

          <label
            htmlFor="amount"
            className="text-xl"

          >Fecha Gasto:</label>
          <DatePicker
            className="custom-datepicker bg-slate-100 p-2 border-0"
            placeholderText="Seleccione una fecha"
            selected={expense.date}
            onChange={handleChangeDate}
          />


        </div>

        <input
          type="submit"
          value={state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
          className="uppercase bg-blue-500 p-2 text-white rounded-md cursor-pointer font-bold" />
      </div>

    </form>
  )
}
