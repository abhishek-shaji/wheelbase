export interface paths {
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Authcontroller.Register
         * @description Register a new user
         */
        post: operations["AuthController_register_auth_register_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Authcontroller.Login */
        post: operations["AuthController_login_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Authcontroller.Logout */
        post: operations["AuthController_logout_auth_logout_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Authcontroller.Session
         * @description Get current logged in user
         */
        get: operations["AuthController_session_auth_session_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/vehicles/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Vehiclescontroller.Get Vehicles
         * @description Get a list of vehicles for the current user
         */
        get: operations["VehiclesController_get_vehicles_vehicles__get"];
        put?: never;
        /**
         * Vehiclescontroller.Create Vehicle
         * @description Create a new vehicle
         */
        post: operations["VehiclesController_create_vehicle_vehicles__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/vehicles/{vehicle_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Vehiclescontroller.Get Vehicle
         * @description Get a vehicle by its ID
         */
        get: operations["VehiclesController_get_vehicle_vehicles__vehicle_id__get"];
        /**
         * Vehiclescontroller.Update Vehicle
         * @description Update an existing vehicle
         */
        put: operations["VehiclesController_update_vehicle_vehicles__vehicle_id__put"];
        post?: never;
        /**
         * Vehiclescontroller.Delete Vehicle
         * @description Delete a vehicle
         */
        delete: operations["VehiclesController_delete_vehicle_vehicles__vehicle_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Organizationscontroller.Get Organizations
         * @description Get a list of organizations for the current user
         */
        get: operations["OrganizationsController_get_organizations_organizations__get"];
        put?: never;
        /**
         * Organizationscontroller.Create Organization
         * @description Create a new organization
         */
        post: operations["OrganizationsController_create_organization_organizations__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Organizationscontroller.Get Organization
         * @description Get an organization by its ID
         */
        get: operations["OrganizationsController_get_organization_organizations__organization_id__get"];
        /**
         * Organizationscontroller.Update Organization
         * @description Update an existing organization
         */
        put: operations["OrganizationsController_update_organization_organizations__organization_id__put"];
        post?: never;
        /**
         * Organizationscontroller.Delete Organization
         * @description Delete an organization
         */
        delete: operations["OrganizationsController_delete_organization_organizations__organization_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/brands/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Brandscontroller.Get Brands
         * @description Get a list of brands for the current user
         */
        get: operations["BrandsController_get_brands_brands__get"];
        put?: never;
        /**
         * Brandscontroller.Create Brand
         * @description Create a new brand
         */
        post: operations["BrandsController_create_brand_brands__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/brands/{brand_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Brandscontroller.Get Brand
         * @description Get a brand by its ID
         */
        get: operations["BrandsController_get_brand_brands__brand_id__get"];
        /**
         * Brandscontroller.Update Brand
         * @description Update an existing brand
         */
        put: operations["BrandsController_update_brand_brands__brand_id__put"];
        post?: never;
        /**
         * Brandscontroller.Delete Brand
         * @description Delete a brand
         */
        delete: operations["BrandsController_delete_brand_brands__brand_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** BrandCreate */
        BrandCreate: {
            /**
             * Name
             * @description Brand's name
             */
            name: string;
        };
        /** BrandResponse */
        BrandResponse: {
            /**
             * Id
             * Format: uuid4
             * @description Unique identifier for the brand
             */
            id: string;
            /**
             * Name
             * @description Brand's name
             */
            name: string;
            /**
             * Created At
             * Format: date-time
             * @description Date and time the brand was created
             */
            created_at: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** OrganizationCreate */
        OrganizationCreate: {
            /**
             * Name
             * @description Organization's name
             */
            name: string;
            /**
             * Email
             * Format: email
             * @description Organization's email address
             */
            email: string;
        };
        /** OrganizationResponse */
        OrganizationResponse: {
            /**
             * Id
             * Format: uuid4
             * @description Unique identifier for the organization
             */
            id: string;
            /**
             * Name
             * @description Organization's name
             */
            name: string;
            /**
             * Email
             * Format: email
             * @description Organization's email address
             */
            email: string;
            /**
             * Created At
             * Format: date-time
             * @description Date and time the organization was created
             */
            created_at: string;
        };
        /** UserCreate */
        UserCreate: {
            /**
             * Email
             * Format: email
             * @description User's email address
             */
            email: string;
            /**
             * Firstname
             * @description User's first name
             */
            firstname: string;
            /**
             * Lastname
             * @description User's last name
             */
            lastname: string;
            /**
             * Password
             * @description User's password
             */
            password: string;
        };
        /** UserLogin */
        UserLogin: {
            /**
             * Email
             * Format: email
             * @description User's email address for login
             */
            email: string;
            /**
             * Password
             * @description User's password for login
             */
            password: string;
        };
        /** UserResponse */
        UserResponse: {
            /**
             * Id
             * Format: uuid4
             * @description Unique identifier for the user
             */
            id: string;
            /**
             * Email
             * Format: email
             * @description User's email address
             */
            email: string;
            /**
             * Firstname
             * @description User's first name
             */
            firstname: string;
            /**
             * Lastname
             * @description User's last name
             */
            lastname: string;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /** VehicleCreate */
        VehicleCreate: {
            /**
             * Registration Number
             * @description Vehicle's registration number
             */
            registration_number: string;
            /**
             * Vin Number
             * @description Vehicle's VIN number
             */
            vin_number: string;
            /**
             * Is New
             * @description Whether the vehicle is new or used
             */
            is_new: boolean;
            /**
             * Kms Driven
             * @description Kilometers driven by the vehicle
             */
            kms_driven: number;
            /**
             * Brand Id
             * Format: uuid4
             * @description ID of the brand of the vehicle
             */
            brand_id: string;
            /**
             * Model
             * @description Model of the vehicle
             */
            model: string;
            /**
             * Price
             * @description Price of the vehicle
             */
            price: number;
            /**
             * First Registration
             * Format: date
             * @description Date of first registration
             */
            first_registration: string;
        };
        /** VehicleResponse */
        VehicleResponse: {
            /**
             * Id
             * Format: uuid4
             * @description Unique identifier for the vehicle
             */
            id: string;
            /**
             * Registration Number
             * @description Vehicle's registration number
             */
            registration_number: string;
            /**
             * Vin Number
             * @description Vehicle's VIN number
             */
            vin_number: string;
            /**
             * Is New
             * @description Whether the vehicle is new or used
             */
            is_new: boolean;
            /**
             * Kms Driven
             * @description Kilometers driven by the vehicle
             */
            kms_driven: number;
            /**
             * Brand Id
             * Format: uuid4
             * @description ID of the brand of the vehicle
             */
            brand_id: string;
            /**
             * Model
             * @description Model of the vehicle
             */
            model: string;
            /**
             * Price
             * @description Price of the vehicle
             */
            price: number;
            /**
             * First Registration
             * Format: date
             * @description Date of first registration
             */
            first_registration: string;
            /**
             * Created At
             * Format: date-time
             * @description Date and time the vehicle was created
             */
            created_at: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type SchemaBrandCreate = components['schemas']['BrandCreate'];
export type SchemaBrandResponse = components['schemas']['BrandResponse'];
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError'];
export type SchemaOrganizationCreate = components['schemas']['OrganizationCreate'];
export type SchemaOrganizationResponse = components['schemas']['OrganizationResponse'];
export type SchemaUserCreate = components['schemas']['UserCreate'];
export type SchemaUserLogin = components['schemas']['UserLogin'];
export type SchemaUserResponse = components['schemas']['UserResponse'];
export type SchemaValidationError = components['schemas']['ValidationError'];
export type SchemaVehicleCreate = components['schemas']['VehicleCreate'];
export type SchemaVehicleResponse = components['schemas']['VehicleResponse'];
export type $defs = Record<string, never>;
export interface operations {
    AuthController_register_auth_register_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    AuthController_login_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserLogin"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    AuthController_logout_auth_logout_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    AuthController_session_auth_session_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
        };
    };
    VehiclesController_get_vehicles_vehicles__get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VehicleResponse"][];
                };
            };
        };
    };
    VehiclesController_create_vehicle_vehicles__post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VehicleCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VehicleResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    VehiclesController_get_vehicle_vehicles__vehicle_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vehicle_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VehicleResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    VehiclesController_update_vehicle_vehicles__vehicle_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vehicle_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VehicleCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VehicleResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    VehiclesController_delete_vehicle_vehicles__vehicle_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vehicle_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    OrganizationsController_get_organizations_organizations__get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationResponse"][];
                };
            };
        };
    };
    OrganizationsController_create_organization_organizations__post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OrganizationCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    OrganizationsController_get_organization_organizations__organization_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    OrganizationsController_update_organization_organizations__organization_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OrganizationCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    OrganizationsController_delete_organization_organizations__organization_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    BrandsController_get_brands_brands__get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"][];
                };
            };
        };
    };
    BrandsController_create_brand_brands__post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BrandCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    BrandsController_get_brand_brands__brand_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                brand_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    BrandsController_update_brand_brands__brand_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                brand_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BrandCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    BrandsController_delete_brand_brands__brand_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                brand_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}
