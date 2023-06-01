export const swapiSchema: {
    'public.films': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        title: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        episode_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        opening_crawl: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        director: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        producer: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        release_date: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
    'public.people': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        name: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        mass: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        hair_color: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        skin_color: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        eye_color: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        birth_year: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        gender: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        species_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        homeworld_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        height: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
    };
    'public.people_in_films': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        person_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        film_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
    'public.pilots': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        person_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        vessel_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
    'public.planets': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        name: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        rotation_period: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        orbital_period: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        diameter: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        climate: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        gravity: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        terrain: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        surface_water: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        population: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
    };
    'public.planets_in_films': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        film_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        planet_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
    'public.species': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        name: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        classification: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        average_height: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        average_lifespan: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        hair_colors: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        skin_colors: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        eye_colors: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        language: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        homeworld_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
    };
    'public.species_in_films': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        film_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        species_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
    'public.starship_specs': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        hyperdrive_rating: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        MGLT: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        vessel_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
    'public.vessels': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        name: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        manufacturer: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        model: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        vessel_type: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        vessel_class: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        cost_in_credits: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        length: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        max_atmosphering_speed: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        crew: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        passengers: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        cargo_capacity: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
        consumables: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: null;
        };
    };
    'public.vessels_in_films': {
        _id: {
            Name: string;
            Value: null;
            TableName: string;
            References: never[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        vessel_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
        film_id: {
            Name: string;
            Value: null;
            TableName: string;
            References: {
                PrimaryKeyName: string;
                PrimaryKeyTableName: string;
                ReferencesPropertyName: string;
                ReferencesTableName: string;
                IsDestination: boolean;
                constraintName: string;
            }[];
            IsPrimaryKey: boolean;
            IsForeignKey: boolean;
            field_name: string;
            data_type: string;
            additional_constraints: string;
        };
    };
};
export const swapiString: string;
//# sourceMappingURL=swapiSchema.d.ts.map