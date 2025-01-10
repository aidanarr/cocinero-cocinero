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

  const [filteredMeals, setFilteredMeals] = useState<mealsData[]>([])
  const [selectedIngredients, setselectedIngredients] = useState<string[]>([])

  useEffect(() => {
    getFilteredMeals()
  }, [selectedIngredients])

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>):void => {
    if (ev.key === "Enter") {
      ev.preventDefault();
    }
  }

  const getIngredients = ():string[] => {

    let allIngredients:string[] = [];
    for (let meal of meals) {
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
    const ingredients = getIngredients();

    return <fieldset>
      <legend>¿Qué ingredientes tengo?</legend>
      {ingredients.map((ingredient) => {
        return <div>
        <input type="checkbox" id={ingredient} name={ingredient} value={ingredient} onChange={handleCheckbox} />
        <label htmlFor={ingredient}>{ingredient}</label>
      </div>
      })}
    </fieldset>
  }

  const handleCheckbox = (ev:React.ChangeEvent<HTMLInputElement>):void => {
    
    if (ev.target.checked === true) {
      setselectedIngredients([...selectedIngredients, ev.target.value])
    } else if (ev.target.checked === false) {
      const ingredientIndex:number = selectedIngredients.indexOf(ev.target.value);
      const ingredientsCopy:string[] = [...selectedIngredients];
      ingredientsCopy.splice(ingredientIndex, 1);
      setselectedIngredients(ingredientsCopy)
    } else null
  }

  const getFilteredMeals = ():void => {

    let filter = meals.filter((meal) => 
      meal.ingredients.some(food => selectedIngredients.includes(food))
    );
    setFilteredMeals(filter);
  }

  const renderMealList = (): ReactNode => {

    const mealList = filteredMeals.length !== 0 ? filteredMeals : meals;

    return mealList.map((meal) => {
      const mealImage: React.CSSProperties = {
        backgroundImage: `url(src/images/${meal.img}.png)`,
      };
      return <article>
        <h3>{meal.name}</h3>
        <div className="meal__img" style={mealImage}></div>
        <ul>
          {meal.ingredients.map((ingredient) => {
            return <li>{ingredient}</li>
          })}
        </ul>
      </article>
    })
  }

  return (
    <>
      <div className="page">
        <form>
          <input type="text" onKeyDown={handleKeyDown} />
          {renderIngredients()}
        </form>
        <section>
          {renderMealList()}
        </section>
      </div>
    </>
  )
}

export default App
