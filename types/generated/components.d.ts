import type { Schema, Struct } from '@strapi/strapi';

export interface EventEventMeal extends Struct.ComponentSchema {
  collectionName: 'components_event_event_meals';
  info: {
    description: 'Jedlo na udalosti';
    displayName: 'Event Meal';
    icon: 'utensils';
    name: 'EventMeal';
  };
  attributes: {
    ingredients: Schema.Attribute.Component<'meal.ingredient', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface EventShoppingItem extends Struct.ComponentSchema {
  collectionName: 'components_event_shopping_items';
  info: {
    description: 'Polo\u017Eka n\u00E1kupn\u00E9ho zoznamu pre udalos\u0165';
    displayName: 'Shopping Item';
    icon: 'shopping-cart';
    name: 'ShoppingItem';
  };
  attributes: {
    amount: Schema.Attribute.String;
    checked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal;
    unit: Schema.Attribute.String;
  };
}

export interface MealIngredient extends Struct.ComponentSchema {
  collectionName: 'components_meal_ingredients';
  info: {
    description: 'Ingrediencia pre jedlo';
    displayName: 'Ingredient';
    icon: 'carrot';
    name: 'Ingredient';
  };
  attributes: {
    amount: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'event.event-meal': EventEventMeal;
      'event.shopping-item': EventShoppingItem;
      'meal.ingredient': MealIngredient;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
