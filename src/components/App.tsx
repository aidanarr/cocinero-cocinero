import '../styles/App.scss'
import { ReactNode, useState, useEffect } from 'react'
import data from "../services/data.json"

const App = () => {

  interface mealsData {
    id: number,
    name: string,
    ingredients: string[],
    img: string
  }

  const meals:mealsData[] = data;

  const [filteredMeals, setFilteredMeals] = useState<mealsData[]>([]);
  const [selectedIngredients, setselectedIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropDown, setDropDown] = useState<boolean>(false);

  useEffect(() => {
    getFilteredMeals()
  }, [selectedIngredients, inputValue])

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>):void => {
    if (ev.key === "Enter") {
      ev.preventDefault();
    }
  }

  const getIngredients = ():string[] => {

    const allIngredients:string[] = [];
    for (const meal of meals) {
      meal.ingredients.map((food) => {
        return allIngredients.push(food)
      })
    }

    const noDuplicatedIngredients:string[] = allIngredients.filter((ingredient, index) => { 
      return allIngredients.indexOf(ingredient) === index
    });

    return noDuplicatedIngredients 
  }

  const renderIngredients = (): ReactNode => {
    const ingredients:string[] = getIngredients().sort();

    return <fieldset className="form__fieldset">
      <label className="form__fieldset--dropdown" htmlFor="dropdown">¿Qué ingredientes tengo? 
        <input name="dropdown" id="dropdown" onChange={handleDropDown} type="checkbox" />
        <i className={`fa-solid fa-caret-down ${dropDown ? "arrow-up" : "arrow-down"}`}></i>
      </label>
      <div className={`form__fieldset--ingredients ${!dropDown ? "hide-ingredients" : "show-ingredients"}`}>
        {ingredients.map((ingredient) => {
          return <div key={ingredient}>
          <input type="checkbox" id={ingredient} name={ingredient} value={ingredient} onChange={handleCheckbox} />
          <label htmlFor={ingredient}>{ingredient}</label>
        </div>
        })}
      </div>
    </fieldset>
  }

  const handleDropDown = (ev:React.ChangeEvent<HTMLInputElement>):void => {
    setDropDown(ev.target.checked)
  }

  const handleCheckbox = (ev:React.ChangeEvent<HTMLInputElement>):void => {
    
    if (ev.target.checked === true) {
      setselectedIngredients([...selectedIngredients, ev.target.value])
    } else if (ev.target.checked === false) {
      const ingredientIndex:number = selectedIngredients.indexOf(ev.target.value);
      const ingredientsCopy:string[] = [...selectedIngredients];
      ingredientsCopy.splice(ingredientIndex, 1);
      setselectedIngredients(ingredientsCopy)
    }
  }

  const handleInput = (ev:React.ChangeEvent<HTMLInputElement>):void => {

    setInputValue(ev.target.value)
  }

  const getFilteredMeals = ():void => {

    const checkboxFilter:mealsData[] = meals.filter((meal) => 
      meal.ingredients.some(food => selectedIngredients.includes(food))
    );  
    
    const nameFilter:mealsData[] | false = inputValue ? meals.filter((meal) => meal.name.includes(inputValue.toLowerCase())) : false;
    const filter:mealsData[] = nameFilter ? nameFilter : checkboxFilter;

    setFilteredMeals(filter);
  }

  const renderMealIngredients = (meal:string[]):ReactNode => {
    const missingIngredients = meal.filter((ingredient) => !selectedIngredients.includes(ingredient));

    if (selectedIngredients.length === 0) {
      return <ul className="ingredients">
           {meal.map((ingredient) => {
            return <li key={ingredient}>{ingredient}</li>
          })}
        </ul>
    } else return <>
            <ul className="ingredients">
              {selectedIngredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
            </ul>
            <ul className="ingredients missing">
              {missingIngredients.map((ingredient) => {
                return  <li key={ingredient}>Falta {ingredient}</li>
              })}
            </ul>
          </>
  }

  const renderMealList = (): ReactNode => {

    const mealList = filteredMeals.length !== 0 ? filteredMeals : meals;

    return mealList.map((meal) => {
      const mealImage: React.CSSProperties = {
        backgroundImage: `url(src/images/${meal.img}.png)`,
      };
      
      return <article className="meal" key={meal.name}>
        <h3>{meal.name}</h3>
        <div className="meal__img" style={mealImage}></div>
        <div>
            {renderMealIngredients(meal.ingredients)}
        </div>
      </article>
    })
  }

  return (
    <>
      <div className="page">
        <h1>Cocinero, cocinero</h1>
        <form className="form">
          <input className="form__input" type="text" onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Busca un plato."/>
          {renderIngredients()}
        </form>
        <section className="list">
          <h2>Comidas</h2>
          <div className="list__meals">
            {renderMealList()}
          </div>
        </section>
      </div>
    </>
  )
}

export default App
