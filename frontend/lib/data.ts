export type DailyState = 'feeling_good' | 'not_hungry' | 'rough_day';

export interface UserPreferences {
  goTos: string[];
  willEat: string[];
  supplements: string[];
  proteinTarget?: number;
  fiberTarget?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'go-to' | 'will-eat' | 'support' | 'supplement';
  role: 'protein' | 'fiber' | 'both' | 'none' | 'supplement';
  effort_level: 'grab-and-go' | 'minimal-prep' | 'needs-cooking';
  benefit_label: string;
  protein_g?: number;
  fiber_g?: number;
  serving_size?: string;
}

export const mockFoodDatabase: FoodItem[] = [
  { id: 'f1', name: 'Protein shake', category: 'go-to', role: 'protein', effort_level: 'grab-and-go', benefit_label: 'Reliable protein, easy to sip', protein_g: 30, fiber_g: 0, serving_size: '1 bottle' },
  { id: 'f2', name: 'String cheese', category: 'go-to', role: 'protein', effort_level: 'grab-and-go', benefit_label: 'Five-second protein', protein_g: 7, fiber_g: 0, serving_size: '1 stick' },
  { id: 'f3', name: 'Hard-boiled eggs', category: 'go-to', role: 'protein', effort_level: 'grab-and-go', benefit_label: 'Quick protein, zero decisions', protein_g: 6, fiber_g: 0, serving_size: '1 egg' },
  { id: 'f4', name: 'Chicken', category: 'will-eat', role: 'protein', effort_level: 'needs-cooking', benefit_label: 'Strong protein foundation', protein_g: 25, fiber_g: 0, serving_size: '4 oz' },
  { id: 'f5', name: 'Greek yogurt', category: 'will-eat', role: 'protein', effort_level: 'grab-and-go', benefit_label: 'Easy protein that actually feels like food', protein_g: 15, fiber_g: 0, serving_size: '¾ cup' },
  { id: 'f6', name: 'Edamame', category: 'will-eat', role: 'both', effort_level: 'minimal-prep', benefit_label: 'Protein + fiber in one move', protein_g: 9, fiber_g: 4, serving_size: '½ cup' },
  { id: 'f7', name: 'Mixed nuts', category: 'go-to', role: 'both', effort_level: 'grab-and-go', benefit_label: 'Small handful, steady fuel', protein_g: 6, fiber_g: 3, serving_size: '¼ cup' },
  { id: 'f7a', name: 'Almonds', category: 'will-eat', role: 'both', effort_level: 'grab-and-go', benefit_label: 'Crunchy energy boost', protein_g: 6, fiber_g: 3, serving_size: '¼ cup' },
  { id: 'f8', name: 'Berries', category: 'will-eat', role: 'fiber', effort_level: 'grab-and-go', benefit_label: 'Light, refreshing fiber', protein_g: 0, fiber_g: 4, serving_size: '1 cup' },
  { id: 'f9', name: 'Sweet potato', category: 'will-eat', role: 'fiber', effort_level: 'needs-cooking', benefit_label: 'Comforting, steady fuel', protein_g: 2, fiber_g: 4, serving_size: '1 medium' },
  { id: 'f10', name: 'Toast', category: 'support', role: 'none', effort_level: 'minimal-prep', benefit_label: 'Gentle on the stomach', protein_g: 3, fiber_g: 1, serving_size: '1 slice' },
  { id: 'f11', name: 'Bone broth', category: 'go-to', role: 'protein', effort_level: 'minimal-prep', benefit_label: 'Warm, easy protein support', protein_g: 10, fiber_g: 0, serving_size: '1 cup' },
  { id: 'f12', name: 'Hummus + veggies', category: 'will-eat', role: 'both', effort_level: 'minimal-prep', benefit_label: 'Fiber support with a little crunch', protein_g: 5, fiber_g: 4, serving_size: '1 serving' },
  { id: 'f13', name: 'Peanut butter on toast', category: 'will-eat', role: 'both', effort_level: 'minimal-prep', benefit_label: 'Comforting protein & fiber', protein_g: 8, fiber_g: 3, serving_size: '1 slice' },
  { id: 'f14', name: 'Avocado', category: 'will-eat', role: 'fiber', effort_level: 'minimal-prep', benefit_label: 'Rich, satisfying fiber', protein_g: 0, fiber_g: 5, serving_size: '½ avocado' },
  { id: 'f15', name: 'Banana', category: 'support', role: 'none', effort_level: 'grab-and-go', benefit_label: 'Gentle energy', protein_g: 0, fiber_g: 0, serving_size: '1 medium' },
  { id: 'f16', name: 'Beans', category: 'will-eat', role: 'both', effort_level: 'minimal-prep', benefit_label: 'Hearty doubles in one bowl', protein_g: 7, fiber_g: 6, serving_size: '½ cup' },
  { id: 'f17', name: 'Protein bar', category: 'go-to', role: 'both', effort_level: 'grab-and-go', benefit_label: 'Pocket-friendly protein + fiber', protein_g: 15, fiber_g: 5, serving_size: '1 bar' },
];

export const generatePlan = (state: DailyState, allowedNames: string[]): FoodItem[] => {
  if (allowedNames.length === 0) return [];

  const items = allowedNames.map(name => {
    const found = mockFoodDatabase.find(f => f.name === name);
    if (found) return found;
    // Fallback for items not explicitly in mockFoodDatabase
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      category: 'will-eat',
      role: 'both',
      effort_level: 'minimal-prep',
      benefit_label: 'Solid choice',
      protein_g: 5,
      fiber_g: 2,
      serving_size: '1 serving'
    } as FoodItem;
  });

  if (state === 'feeling_good') return items.slice(0, 5);
  if (state === 'not_hungry') return items.slice(0, 4);
  return items.slice(0, 3);
};

