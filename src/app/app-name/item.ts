export interface Pokemon {
    value: string;
    viewValue: string;
}

export interface PokemonGroup {
    disabled?: boolean;
    name: string;
    pokemon: Pokemon[];
}

export interface Testeditems{
    value: string;
    testitem: string;
    description: string;
    details: string;
    name?: string;
    linkstackblitz: string;
}

export interface loaditems{
    description: string;
    details: string;
    linkstackblitz: string;
    value: string;
    viewValue?: string;
    disabled?: boolean;
    name?: string;
    testitem: string;
    id?:string;
}

export interface loadkeys{
    mykey: string;
}

export interface mykeys { item: string;}