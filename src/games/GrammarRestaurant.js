import React, { useState, useEffect } from 'react';
import { 
  ChefHat, Utensils, Star, Clock, Heart, Trophy,
  CheckCircle, XCircle, RotateCcw, Lightbulb,
  Flame, Target, Crown, Coffee, Pizza, Cookie
} from 'lucide-react';

const recipeQuests = [
  {
    id: 1,
    dishName: "Perfect Pasta Salad",
    difficulty: "Apprentice Chef",
    cookingTime: "15 min",
    customers: 3,
    story: "Three hungry customers ordered pasta salad, but the recipe card is missing punctuation!",
    recipe: "Mix pasta tomatoes olives and cheese with dressing",
    ingredients: ["pasta", "tomatoes", "olives", "cheese", "dressing"],
    options: [
      { 
        text: "Mix pasta tomatoes olives and cheese with dressing.",
        correct: false, 
        feedback: "The ingredients are all jumbled together! Customers can't tell what's in it.",
        rating: 1
      },
      { 
        text: "Mix pasta, tomatoes, olives, and cheese with dressing.",
        correct: true, 
        feedback: "Perfect! Clear ingredients list - customers love it!",
        rating: 5
      },
      { 
        text: "Mix pasta tomatoes, olives, and cheese with dressing.",
        correct: false, 
        feedback: "Missing comma after pasta - the recipe is confusing!",
        rating: 2
      },
      { 
        text: "Mix pasta, tomatoes olives, and cheese with dressing.",
        correct: false, 
        feedback: "Missing comma between tomatoes and olives!",
        rating: 2
      }
    ],
    grammarRule: "Use commas to separate items in a list to make recipes clear and easy to follow.",
    tips: 100,
    dishEmoji: "🍝"
  },
  {
    id: 2,
    dishName: "Mystery Soup Special",
    difficulty: "Line Cook",
    cookingTime: "20 min",
    customers: 4,
    story: "A customer wants to know about today's soup special, but your response needs proper punctuation!",
    recipe: "Is the soup vegetarian or does it contain meat",
    ingredients: ["vegetables", "broth", "herbs", "mystery ingredient"],
    options: [
      { 
        text: "Is the soup vegetarian or does it contain meat.",
        correct: false, 
        feedback: "That's not how you ask a question! Customer is confused.",
        rating: 1
      },
      { 
        text: "Is the soup vegetarian or does it contain meat?",
        correct: true, 
        feedback: "Great question format! Customer appreciates the clear inquiry.",
        rating: 5
      },
      { 
        text: "Is the soup vegetarian or does it contain meat!",
        correct: false, 
        feedback: "Too excited! Questions need question marks, not exclamation points.",
        rating: 2
      },
      { 
        text: "is the soup vegetarian or does it contain meat?",
        correct: false, 
        feedback: "Good question mark, but don't forget to capitalize the first word!",
        rating: 3
      }
    ],
    grammarRule: "Questions end with question marks (?), and sentences begin with capital letters.",
    tips: 150,
    dishEmoji: "🍲"
  },
  {
    id: 3,
    dishName: "Chef's Signature Sandwich",
    difficulty: "Sous Chef",
    cookingTime: "12 min", 
    customers: 5,
    story: "The head chef is describing today's special sandwich, but the description needs apostrophes!",
    recipe: "The chefs special sandwich uses the restaurants best ingredients",
    ingredients: ["artisan bread", "premium meats", "fresh vegetables", "house sauce"],
    options: [
      { 
        text: "The chefs special sandwich uses the restaurants best ingredients.",
        correct: false, 
        feedback: "Who owns what? Customers can't tell without apostrophes!",
        rating: 1
      },
      { 
        text: "The chef's special sandwich uses the restaurant's best ingredients.",
        correct: true, 
        feedback: "Excellent! Clear ownership - customers know it's high quality!",
        rating: 5
      },
      { 
        text: "The chefs' special sandwich uses the restaurants best ingredients.",
        correct: false, 
        feedback: "Wrong apostrophe placement - this suggests multiple chefs!",
        rating: 2
      },
      { 
        text: "The chef's special sandwich uses the restaurants' best ingredients.",
        correct: false, 
        feedback: "Good for chef's, but restaurants' suggests multiple restaurants!",
        rating: 3
      }
    ],
    grammarRule: "Use apostrophes to show possession (chef's = belonging to the chef).",
    tips: 200,
    dishEmoji: "🥪"
  },
  {
    id: 4,
    dishName: "Exciting Dessert Surprise",
    difficulty: "Head Chef",
    cookingTime: "25 min",
    customers: 6,
    story: "You're announcing an amazing new dessert to the dining room, and everyone should be excited!",
    recipe: "Attention everyone we have a new chocolate lava cake with ice cream",
    ingredients: ["chocolate", "cake", "vanilla ice cream", "raspberry sauce"],
    options: [
      { 
        text: "Attention everyone we have a new chocolate lava cake with ice cream.",
        correct: false, 
        feedback: "Too calm for such an exciting announcement! Customers aren't impressed.",
        rating: 2
      },
      { 
        text: "Attention everyone! We have a new chocolate lava cake with ice cream!",
        correct: true, 
        feedback: "Perfect excitement! Customers are thrilled and can't wait to try it!",
        rating: 5
      },
      { 
        text: "Attention everyone? We have a new chocolate lava cake with ice cream?",
        correct: false, 
        feedback: "Why are you asking? Customers are confused about the announcement.",
        rating: 1
      },
      { 
        text: "Attention everyone, we have a new chocolate lava cake with ice cream.",
        correct: false, 
        feedback: "Good comma, but needs more excitement for a special announcement!",
        rating: 3
      }
    ],
    grammarRule: "Use exclamation marks (!) to show excitement and enthusiasm in announcements.",
    tips: 250,
    dishEmoji: "🍰"
  }
];

const GrammarRestaurant = () => {
  const [currentOrder, setCurrentOrder] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameState, setGameState] = useState('cooking'); // 'cooking', 'served', 'failed', 'complete'
  const [showRecipe, setShowRecipe] = useState(false);
  const [chefStats, setChefStats] = useState({
    rank: "Apprentice Chef",
    totalTips: 0,
    customersServed: 0,
    averageRating: 0,
    perfectDishes: 0
  });
  const [orderTimer, setOrderTimer] = useState(45);
  const [timerActive, setTimerActive] = useState(false);
  const [restaurantBusy, setRestaurantBusy] = useState(false);

  const currentRecipe = recipeQuests[currentOrder];

  // Kitchen timer
  useEffect(() => {
    let interval;
    if (timerActive && orderTimer > 0 && gameState === 'cooking') {
      interval = setInterval(() => {
        setOrderTimer(prev => prev - 1);
      }, 1000);
    } else if (orderTimer === 0 && gameState === 'cooking') {
      setGameState('failed');
      setTimerActive(false);
      setRestaurantBusy(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, orderTimer, gameState]);

  const getRankFromTips = (tips) => {
    if (tips >= 700) return "Master Chef";
    if (tips >= 500) return "Head Chef";
    if (tips >= 300) return "Sous Chef";
    if (tips >= 150) return "Line Cook";
    return "Apprentice Chef";
  };

  const getBadgeFromRank = (rank) => {
    const badges = {
      "Master Chef": "👨‍🍳",
      "Head Chef": "🏆", 
      "Sous Chef": "⭐",
      "Line Cook": "🥇",
      "Apprentice Chef": "👨‍🏫"
    };
    return badges[rank] || "👨‍🏫";
  };

  const handleOptionSelect = (optionIndex) => {
    if (gameState !== 'cooking') return;
    setSelectedOption(optionIndex);
  };

  const serveDish = () => {
    if (selectedOption === null) return;
    
    setTimerActive(false);
    setRestaurantBusy(false);
    const selectedDish = currentRecipe.options[selectedOption];
    const isCorrect = selectedDish.correct;
    
    if (isCorrect) {
      setGameState('served');
      const timeBonus = Math.floor(orderTimer / 5) * 10;
      const totalTips = currentRecipe.tips + timeBonus;
      
      setChefStats(prev => {
        const newTotalTips = prev.totalTips + totalTips;
        const newCustomersServed = prev.customersServed + currentRecipe.customers;
        const newPerfectDishes = prev.perfectDishes + 1;
        const newRank = getRankFromTips(newTotalTips);
        
        return {
          ...prev,
          rank: newRank,
          totalTips: newTotalTips,
          customersServed: newCustomersServed,
          perfectDishes: newPerfectDishes,
          averageRating: Math.round(((prev.averageRating * currentOrder) + selectedDish.rating) / (currentOrder + 1) * 10) / 10
        };
      });
    } else {
      setGameState('failed');
      setChefStats(prev => ({
        ...prev,
        customersServed: prev.customersServed + currentRecipe.customers,
        averageRating: Math.round(((prev.averageRating * currentOrder) + selectedDish.rating) / (currentOrder + 1) * 10) / 10
      }));
    }
  };

  const nextOrder = () => {
    if (currentOrder < recipeQuests.length - 1) {
      setCurrentOrder(prev => prev + 1);
      setSelectedOption(null);
      setGameState('cooking');
      setShowRecipe(false);
      setOrderTimer(45);
      setTimerActive(false);
      setRestaurantBusy(false);
    } else {
      setGameState('complete');
    }
  };

  const resetOrder = () => {
    setSelectedOption(null);
    setGameState('cooking');
    setShowRecipe(false);
    setOrderTimer(45);
    setTimerActive(false);
    setRestaurantBusy(false);
  };

  const startCooking = () => {
    setTimerActive(true);
    setRestaurantBusy(true);
  };

  const restartGame = () => {
    setCurrentOrder(0);
    setSelectedOption(null);
    setGameState('cooking');
    setShowRecipe(false);
    setChefStats({
      rank: "Apprentice Chef",
      totalTips: 0,
      customersServed: 0,
      averageRating: 0,
      perfectDishes: 0
    });
    setOrderTimer(45);
    setTimerActive(false);
    setRestaurantBusy(false);
  };

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 text-center max-w-2xl border border-yellow-500/30 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 text-2xl">
                {getBadgeFromRank(chefStats.rank)}
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            SERVICE COMPLETE!
          </h1>
          <p className="text-2xl text-orange-300 mb-2">Congratulations, Chef {chefStats.rank}!</p>
          <p className="text-lg text-gray-300 mb-6">Your restaurant is now famous for perfect grammar!</p>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">${chefStats.totalTips}</div>
                <div className="text-sm text-gray-400">Total Tips</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{chefStats.customersServed}</div>
                <div className="text-sm text-gray-400">Customers Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{chefStats.perfectDishes}</div>
                <div className="text-sm text-gray-400">Perfect Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{chefStats.averageRating}</div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={restartGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-yellow-500/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ChefHat className="w-12 h-12 text-yellow-400" />
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 text-sm">
                {getBadgeFromRank(chefStats.rank)}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Grammar Restaurant
              </h1>
              <p className="text-orange-300">Chef {chefStats.rank}</p>
            </div>
          </div>
          
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">${chefStats.totalTips}</div>
              <div className="text-xs text-gray-400">Tips</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{chefStats.customersServed}</div>
              <div className="text-xs text-gray-400">Served</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {chefStats.averageRating > 0 ? chefStats.averageRating : '0.0'}
              </div>
              <div className="text-xs text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Order Progress</span>
          <span className="text-orange-300">{currentOrder + 1} / {recipeQuests.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentOrder + 1) / recipeQuests.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipe Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                  <span className="text-3xl">{currentRecipe.dishEmoji}</span>
                  {currentRecipe.dishName}
                </h2>
                <div className="flex gap-4 text-sm text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {currentRecipe.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentRecipe.cookingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-4 h-4" />
                    {currentRecipe.customers} customers
                  </span>
                </div>
              </div>
              
              {timerActive && (
                <div className={`text-2xl font-bold ${orderTimer <= 10 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
                  {orderTimer}s
                </div>
              )}
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
              <p className="text-gray-300 mb-3">{currentRecipe.story}</p>
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                <p className="text-yellow-300 font-mono">"{currentRecipe.recipe}"</p>
              </div>
            </div>

            {!timerActive && gameState === 'cooking' && (
              <button 
                onClick={startCooking}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                <Flame className="w-5 h-5" />
                Start Cooking!
              </button>
            )}

            {timerActive && gameState === 'cooking' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Choose the correct punctuation:</h3>
                {currentRecipe.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="font-mono">"{option.text}"</span>
                  </button>
                ))}
                
                {selectedOption !== null && (
                  <button 
                    onClick={serveDish}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Utensils className="w-5 h-5" />
                    Serve Dish!
                  </button>
                )}
              </div>
            )}

            {/* Feedback */}
            {(gameState === 'served' || gameState === 'failed') && selectedOption !== null && (
              <div className={`mt-4 p-4 rounded-xl border-2 ${
                gameState === 'served' 
                  ? 'border-green-500 bg-green-500/20' 
                  : 'border-red-500 bg-red-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {gameState === 'served' ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`font-bold ${
                    gameState === 'served' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {gameState === 'served' ? 'Perfect Service!' : 'Order Failed!'}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">
                  {currentRecipe.options[selectedOption].feedback}
                </p>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= currentRecipe.options[selectedOption].rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
                {gameState === 'served' && (
                  <div className="text-green-300 font-bold">
                    +${currentRecipe.tips + Math.floor(orderTimer / 5) * 10} tips!
                    {orderTimer > 30 && <span className="text-yellow-300"> (Speed bonus!)</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Kitchen Status */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-orange-400" />
              Kitchen Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Service</span>
                <span className={`font-bold ${
                  restaurantBusy ? 'text-red-400' : 'text-green-400'
                }`}>
                  {restaurantBusy ? 'BUSY' : 'READY'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order #{currentOrder + 1}</span>
                <span className="text-orange-400 font-bold">{currentRecipe.dishName}</span>
              </div>
            </div>
          </div>

          {/* Grammar Tip */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/30">
            <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Grammar Tip
            </h3>
            <p className="text-gray-300 text-sm">
              {currentRecipe.grammarRule}
            </p>
          </div>

          {/* Ingredients */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Pizza className="w-5 h-5 text-yellow-400" />
              Ingredients
            </h3>
            <div className="space-y-2">
              {currentRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <Cookie className="w-4 h-4 text-orange-400" />
                  <span className="capitalize">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {(gameState === 'served' || gameState === 'failed') && (
            <div className="space-y-3">
              {currentOrder < recipeQuests.length - 1 ? (
                <button 
                  onClick={nextOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Next Order
                </button>
              ) : (
                <button 
                  onClick={nextOrder}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Finish Service
                </button>
              )}
              
              <button 
                onClick={resetOrder}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarRestaurant;