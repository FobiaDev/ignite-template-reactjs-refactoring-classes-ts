import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Card from "../../components/Card";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { Food } from "../../types";

const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isModalAddFood, setisModalAddFood] = useState<boolean>(false);
  const [isModalEditFood, setisModalEditFood] = useState<boolean>(false);

  useEffect(() => {
    api.get("/foods").then((response) => setFoods(response.data));
  }, []);

  const handleAddFood = async (food: Food) => {
    try {
      if (food.description && food.image && food.name && food.price) {
        await api.post("/foods", {
          ...food,
          available: true,
        });
        await api.get("/foods").then((response) => setFoods(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvailableFood = async (food: Food) => {
    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !food.available,
    });
    await api.get("/foods").then((response) => setFoods(response.data));
  };

  const handleUpdateFood = async (food: Food) => {
    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        });

        await api.get("/foods").then((response) => setFoods(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditFood = (food?: Food) => {
    setisModalEditFood((prev) => !prev);
    setEditingFood(food ?? null);
  };

  const handleAddFoodModal = () => {
    setisModalAddFood((prev) => !prev);
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    await api.get("/foods").then((response) => setFoods(response.data));
  };

  return (
    <>
      <Header openModal={handleAddFoodModal} />
      <ModalAddFood
        isOpen={isModalAddFood}
        setIsOpen={handleAddFoodModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isModalEditFood}
        setIsOpen={handleEditFood}
        editingFood={editingFood ?? {}}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Card
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleAvailableFood={handleAvailableFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
