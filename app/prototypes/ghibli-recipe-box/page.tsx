'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

// Helper for image paths
const getImagePath = (path: string) => {
  // Check if we're in production with basePath
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/ghibli-recipes')) {
    return `/ghibli-recipes${path}`;
  }
  return path;
};

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  notes: string;
  stains: string[];
  ghibliFilm: string;
  foodIllustration: string;
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Totoro's Forest Mushroom Soup",
    description: "A hearty soup that warms the soul on rainy days",
    ingredients: [
      "2 cups wild mushrooms",
      "1 large onion, diced",
      "3 cloves garlic",
      "4 cups vegetable broth",
      "1/2 cup cream",
      "Fresh herbs (thyme, rosemary)",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Clean mushrooms gently with a damp cloth",
      "Sauté onions until translucent",
      "Add mushrooms and cook until golden",
      "Pour in broth and simmer 20 minutes",
      "Blend until smooth, add cream",
      "Season and garnish with herbs"
    ],
    notes: "Best enjoyed while listening to rain on the roof. The forest spirits say this recipe brings good dreams.",
    stains: ["tea", "ink", "flour"],
    ghibliFilm: "Spirited Away",
    foodIllustration: "soup"
  },
  {
    id: 2,
    title: "Howl's Moving Castle Breakfast",
    description: "A magical morning meal that starts your day right",
    ingredients: [
      "3 eggs",
      "2 slices thick bread",
      "Fresh berries",
      "Honey",
      "Butter",
      "A pinch of magic (optional)"
    ],
    instructions: [
      "Toast bread until golden",
      "Fry eggs sunny-side up",
      "Arrange berries on toast",
      "Drizzle with honey",
      "Add eggs on top",
      "Sprinkle with magic if available"
    ],
    notes: "Calcifer says this recipe makes the castle move smoother. Don't tell him it's just the coffee!",
    stains: ["coffee", "jam", "egg"],
    ghibliFilm: "Howl's Moving Castle",
    foodIllustration: "toast"
  },
  {
    id: 3,
    title: "Ponyo's Magical Ramen",
    description: "A warm bowl of ramen that brings families together",
    ingredients: [
      "Fresh ramen noodles",
      "Rich pork broth",
      "Sliced pork belly",
      "Soft-boiled eggs",
      "Green onions",
      "Nori seaweed",
      "Sesame seeds"
    ],
    instructions: [
      "Boil ramen noodles until al dente",
      "Heat rich pork broth to simmer",
      "Slice pork belly thinly",
      "Soft-boil eggs to perfection",
      "Assemble bowls with noodles and broth",
      "Top with pork, eggs, and garnishes"
    ],
    notes: "This ramen has the power to bring families together, just like Ponyo's love!",
    stains: ["broth", "soy", "oil"],
    ghibliFilm: "Ponyo",
    foodIllustration: "ramen"
  },
  {
    id: 4,
    title: "Kiki's Magical Cake",
    description: "A beautiful cake that brings joy to every delivery",
    ingredients: [
      "2 cups flour",
      "1 cup sugar",
      "3 eggs",
      "1/2 cup butter",
      "1 cup milk",
      "2 tsp baking powder",
      "Vanilla extract",
      "Fresh berries for decoration"
    ],
    instructions: [
      "Cream butter and sugar until fluffy",
      "Beat in eggs one at a time",
      "Mix flour and baking powder",
      "Alternate adding flour and milk",
      "Add vanilla extract",
      "Bake at 350°F for 30 minutes",
      "Cool and decorate with berries"
    ],
    notes: "This cake is so magical, it might just help you fly! Perfect for special deliveries.",
    stains: ["flour", "milk", "butter"],
    ghibliFilm: "Kiki's Delivery Service",
    foodIllustration: "cake"
  },
  {
    id: 5,
    title: "Spirited Away Soup Dumplings",
    description: "Delicate dumplings that warm the soul",
    ingredients: [
      "Dumpling wrappers",
      "Ground pork",
      "Shrimp",
      "Ginger",
      "Green onions",
      "Soy sauce",
      "Sesame oil",
      "Rich broth"
    ],
    instructions: [
      "Mix pork, shrimp, and seasonings",
      "Wrap filling in dumpling wrappers",
      "Steam until translucent",
      "Prepare rich, flavorful broth",
      "Serve dumplings in warm broth",
      "Garnish with green onions"
    ],
    notes: "These dumplings have the power to restore memories and bring comfort to weary travelers.",
    stains: ["soy", "oil", "broth"],
    ghibliFilm: "Spirited Away",
    foodIllustration: "bento"
  }
];

export default function GhibliRecipeBox() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [motionPermissionGranted, setMotionPermissionGranted] = useState(false);

  // Request motion permission (required for iOS 13+)
  const requestMotionPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setMotionPermissionGranted(true);
          return true;
        } else {
          console.log('Device motion permission denied');
          return false;
        }
      } catch (error) {
        console.log('Error requesting device motion permission:', error);
        return false;
      }
    } else {
      // For devices that don't require permission (older iOS, Android)
      setMotionPermissionGranted(true);
      return true;
    }
  };

  // Shake detection - only active after permission is granted
  useEffect(() => {
    if (!motionPermissionGranted) return;

    let lastShakeTime = 0;
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    const threshold = 15; // Adjust sensitivity
    const minTimeBetweenShakes = 1000; // 1 second

    const handleShake = (event: DeviceMotionEvent) => {
      // Try accelerationIncludingGravity first (iOS), then acceleration (Android)
      const acceleration = event.accelerationIncludingGravity || event.acceleration;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;
      
      // Calculate change in acceleration (more accurate for shake detection)
      const deltaX = Math.abs(x - lastAcceleration.x);
      const deltaY = Math.abs(y - lastAcceleration.y);
      const deltaZ = Math.abs(z - lastAcceleration.z);
      
      const totalDelta = deltaX + deltaY + deltaZ;
      const currentTime = Date.now();

      if (totalDelta > threshold && 
          currentTime - lastShakeTime > minTimeBetweenShakes) {
        lastShakeTime = currentTime;
        // Trigger shake - keep card visible, just change recipe
        setIsShaking(true);
        const wasShowing = showCard && currentRecipe;
        
        setTimeout(() => {
          // Pick a different recipe if one is already showing
          let randomIndex = Math.floor(Math.random() * recipes.length);
          if (wasShowing && currentRecipe) {
            // Make sure we pick a different recipe
            while (recipes[randomIndex].id === currentRecipe.id && recipes.length > 1) {
              randomIndex = Math.floor(Math.random() * recipes.length);
            }
          }
          setCurrentRecipe(recipes[randomIndex]);
          setIsShaking(false);
          setShowCard(true);
        }, 1800); // Match animation duration (1.8 seconds)
      }
      
      lastAcceleration = { x, y, z };
    };

    window.addEventListener('devicemotion', handleShake, { passive: true });

    return () => {
      window.removeEventListener('devicemotion', handleShake);
    };
  }, [motionPermissionGranted, showCard, currentRecipe]);

  const shakeRecipeBox = () => {
    setIsShaking(true);
    // Keep the card visible - don't hide it, just change the recipe
    const wasShowing = showCard && currentRecipe;
    
    setTimeout(() => {
      // Pick a different recipe if one is already showing
      let randomIndex = Math.floor(Math.random() * recipes.length);
      if (wasShowing && currentRecipe) {
        // Make sure we pick a different recipe
        while (recipes[randomIndex].id === currentRecipe.id && recipes.length > 1) {
          randomIndex = Math.floor(Math.random() * recipes.length);
        }
      }
      setCurrentRecipe(recipes[randomIndex]);
      setIsShaking(false);
      setShowCard(true);
    }, 1800); // Match animation duration (1.8 seconds)
  };

  const handleManualShake = async () => {
    // Request permission if not already granted (for iOS)
    if (!motionPermissionGranted) {
      await requestMotionPermission();
    }
    shakeRecipeBox();
  };

  // Auto-request permission on component mount for non-iOS devices
  useEffect(() => {
    // Only auto-request if permission API doesn't exist (non-iOS)
    if (typeof DeviceMotionEvent === 'undefined' || 
        typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      setMotionPermissionGranted(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.notecardBackground}>
        <div className={styles.header}>
          <h1 className={styles.title}>Studio Ghibli Recipe Box</h1>
          <p className={styles.subtitle}>Shake your device to discover a magical recipe!</p>
        </div>

        {showCard && currentRecipe && (
          <div 
            className={`${styles.recipeCard} ${isShaking ? styles.shaking : ''}`}
            style={{
              backgroundImage: `url(${getImagePath('/images/other/notecard.png')}), linear-gradient(135deg, #fdf6e3 0%, #f4f1e8 25%, #ede8d8 50%, #e6ddd0 75%, #ddd4c7 100%)`
            }}
          >
            <div className={styles.cardHeader}>
              <h2 className={styles.recipeTitle}>{currentRecipe.title}</h2>
              <p className={styles.filmSource}>from {currentRecipe.ghibliFilm}</p>
            </div>
            
            <div className={styles.cardContent}>
              <p className={styles.description}>{currentRecipe.description}</p>
              
              {/* Food Illustration */}
              <div className={styles.foodIllustration}>
                <div className={styles.watercolorImage}>
                  {currentRecipe.foodIllustration === 'ramen' && (
                    <img 
                      src={getImagePath('/images/food/ramen.png')} 
                      alt="Ramen Bowl" 
                      className={styles.watercolorFoodImage}
                      onError={(e) => {
                        // Fallback to emoji if image not found
                        e.currentTarget.style.display = 'none';
                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  )}
                  {currentRecipe.foodIllustration === 'toast' && (
                    <img 
                      src={getImagePath('/images/food/eggs-and-toast.png')} 
                      alt="Toast & Egg" 
                      className={styles.watercolorFoodImage}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  )}
                  {currentRecipe.foodIllustration === 'soup' && (
                    <img 
                      src={getImagePath('/images/food/pie.png')} 
                      alt="Mushroom Soup" 
                      className={styles.watercolorFoodImage}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  )}
                  {currentRecipe.foodIllustration === 'cake' && (
                    <img 
                      src={getImagePath('/images/food/kiki-cake.png')} 
                      alt="Magical Cake" 
                      className={styles.watercolorFoodImage}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  )}
                  {currentRecipe.foodIllustration === 'bento' && (
                    <img 
                      src={getImagePath('/images/food/bento.png')} 
                      alt="Bento Box" 
                      className={styles.watercolorFoodImage}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  )}
                  
                  {/* Fallback emoji placeholders */}
                  <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                    {currentRecipe.foodIllustration === 'ramen' && (
                      <>
                        <div className={styles.imageText}>🍜</div>
                        <div className={styles.imageSubtext}>Ramen Bowl</div>
                      </>
                    )}
                    {currentRecipe.foodIllustration === 'toast' && (
                      <>
                        <div className={styles.imageText}>🍞</div>
                        <div className={styles.imageSubtext}>Toast & Egg</div>
                      </>
                    )}
                    {currentRecipe.foodIllustration === 'soup' && (
                      <>
                        <div className={styles.imageText}>🍲</div>
                        <div className={styles.imageSubtext}>Mushroom Soup</div>
                      </>
                    )}
                    {currentRecipe.foodIllustration === 'cake' && (
                      <>
                        <div className={styles.imageText}>🧁</div>
                        <div className={styles.imageSubtext}>Magical Cake</div>
                      </>
                    )}
                    {currentRecipe.foodIllustration === 'bento' && (
                      <>
                        <div className={styles.imageText}>🍱</div>
                        <div className={styles.imageSubtext}>Bento Box</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.ingredients}>
                <h3 className={styles.sectionTitle}>Ingredients</h3>
                <ul className={styles.ingredientList}>
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className={styles.ingredient}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.instructions}>
                <h3 className={styles.sectionTitle}>Instructions</h3>
                <ol className={styles.instructionList}>
                  {currentRecipe.instructions.map((instruction, index) => (
                    <li key={index} className={styles.instruction}>{instruction}</li>
                  ))}
                </ol>
              </div>
              
              <div className={styles.notes}>
                <h3 className={styles.sectionTitle}>Notes</h3>
                <p className={styles.noteText}>{currentRecipe.notes}</p>
              </div>
            </div>
            
            {/* Mysterious stains */}
            {currentRecipe.stains.map((stain, index) => (
              <div 
                key={index} 
                className={`${styles.stain} ${styles[`stain-${stain}`]}`}
                style={{
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              ></div>
            ))}
        </div>
        )}
        
        {!showCard && (
          <div className={styles.emptyBox}>
            <img 
              src={getImagePath('/images/other/notecard-box.png')} 
              alt="Recipe Box" 
              className={`${styles.notecardBoxImage} ${isShaking ? styles.shaking : ''}`}
            />
            <p className={`${styles.shakePrompt} ${isShaking ? styles.shaking : ''}`}>Reach into the recipe box...</p>
            <button 
              className={`${styles.manualShake} ${isShaking ? styles.shaking : ''}`}
              onClick={handleManualShake}
            >
              Pull out a recipe!
            </button>
          </div>
        )}
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Each recipe comes with notes at the bottom from the Ghibli Kitchen.
          </p>
        </div>
      </div>
    </div>
  );
}
