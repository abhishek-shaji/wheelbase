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
    "/organizations/{organization_id}/vehicles/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Vehiclescontroller.Get Vehicles */
        get: operations["VehiclesController_get_vehicles_organizations__organization_id__vehicles__get"];
        put?: never;
        /** Vehiclescontroller.Create Vehicle */
        post: operations["VehiclesController_create_vehicle_organizations__organization_id__vehicles__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/vehicles/{vehicle_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Vehiclescontroller.Get Vehicle */
        get: operations["VehiclesController_get_vehicle_organizations__organization_id__vehicles__vehicle_id__get"];
        /** Vehiclescontroller.Update Vehicle */
        put: operations["VehiclesController_update_vehicle_organizations__organization_id__vehicles__vehicle_id__put"];
        post?: never;
        /** Vehiclescontroller.Delete Vehicle */
        delete: operations["VehiclesController_delete_vehicle_organizations__organization_id__vehicles__vehicle_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/vehicles/{vehicle_id}/mark-as-sold": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Vehiclescontroller.Mark Vehicle As Sold */
        post: operations["VehiclesController_mark_vehicle_as_sold_organizations__organization_id__vehicles__vehicle_id__mark_as_sold_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/vehicles/{vehicle_id}/mark-as-unsold": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Vehiclescontroller.Mark Vehicle As Unsold */
        post: operations["VehiclesController_mark_vehicle_as_unsold_organizations__organization_id__vehicles__vehicle_id__mark_as_unsold_post"];
        delete?: never;
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
         * @description Get a list of brands
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
    "/organizations/{organization_id}/customers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Customerscontroller.Get Customers
         * @description Get a list of customers for an organization
         */
        get: operations["CustomersController_get_customers_organizations__organization_id__customers_get"];
        put?: never;
        /**
         * Customerscontroller.Create Customer
         * @description Create a new customer for an organization
         */
        post: operations["CustomersController_create_customer_organizations__organization_id__customers_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/customers/{customer_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Customerscontroller.Get Customer
         * @description Get a customer by its ID
         */
        get: operations["CustomersController_get_customer_organizations__organization_id__customers__customer_id__get"];
        /**
         * Customerscontroller.Update Customer
         * @description Update an existing customer
         */
        put: operations["CustomersController_update_customer_organizations__organization_id__customers__customer_id__put"];
        post?: never;
        /**
         * Customerscontroller.Delete Customer
         * @description Delete a customer
         */
        delete: operations["CustomersController_delete_customer_organizations__organization_id__customers__customer_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/statistics/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Statisticscontroller.Get Dashboard Statistics
         * @description Get dashboard statistics for an organization
         */
        get: operations["StatisticsController_get_dashboard_statistics_organizations__organization_id__statistics_dashboard_get"];
        put?: never;
        post?: never;
        delete?: never;
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
        /** CustomerCreate */
        CustomerCreate: {
            /**
             * First Name
             * @description Customer's first name
             */
            first_name: string;
            /**
             * Last Name
             * @description Customer's last name
             */
            last_name: string;
            /**
             * Email
             * Format: email
             * @description Customer's email address
             */
            email: string;
            /**
             * Phone
             * @description Customer's phone number
             */
            phone: string;
        };
        /** CustomerResponse */
        CustomerResponse: {
            /**
             * Id
             * Format: uuid4
             * @description Unique identifier for the customer
             */
            id: string;
            /**
             * First Name
             * @description Customer's first name
             */
            first_name: string;
            /**
             * Last Name
             * @description Customer's last name
             */
            last_name: string;
            /**
             * Email
             * Format: email
             * @description Customer's email address
             */
            email: string;
            /**
             * Phone
             * @description Customer's phone number
             */
            phone: string;
            /**
             * Organization Id
             * Format: uuid4
             * @description ID of the organization the customer belongs to
             */
            organization_id: string;
            /**
             * Created At
             * Format: date-time
             * @description Date and time the customer was created
             */
            created_at: string;
        };
        /** CustomerStatistics */
        CustomerStatistics: {
            /**
             * Total Count
             * @description Total number of customers
             */
            total_count: number;
            /**
             * Customers By Month
             * @description Number of new customers by month
             */
            customers_by_month: {
                [key: string]: number;
            };
        };
        /** DashboardStatistics */
        DashboardStatistics: {
            /** @description Vehicle statistics */
            vehicles: components["schemas"]["VehicleStatistics"];
            /** @description Customer statistics */
            customers: components["schemas"]["CustomerStatistics"];
            /**
             * Total Revenue
             * @description Total revenue from vehicle sales
             */
            total_revenue: number;
            /**
             * Revenue By Month
             * @description Revenue by month
             */
            revenue_by_month: {
                [key: string]: number;
            };
        };
        /**
         * FuelType
         * @enum {string}
         */
        FuelType: "electric" | "diesel" | "petrol" | "hybrid";
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
        /** Page[VehicleResponse] */
        Page_VehicleResponse_: {
            /** Items */
            items: components["schemas"]["VehicleResponse"][];
            /** Total */
            total?: number | null;
            /** Page */
            page: number | null;
            /** Size */
            size: number | null;
            /** Pages */
            pages?: number | null;
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
             * Model Year
             * @description Year the vehicle model was manufactured
             */
            model_year: number;
            /** @description Type of fuel the vehicle uses */
            fuel_type: components["schemas"]["FuelType"];
            /**
             * Color
             * @description Color of the vehicle
             */
            color?: string | null;
            /**
             * Description
             * @description Additional description of the vehicle
             */
            description?: string | null;
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
        /** VehicleMarkAsSold */
        VehicleMarkAsSold: {
            /**
             * Sold To Id
             * Format: uuid4
             * @description ID of the customer the vehicle is sold to
             */
            sold_to_id: string;
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
             * Sold To Id
             * @description ID of the customer the vehicle is sold to
             */
            sold_to_id?: string | null;
            /**
             * Sold At
             * @description Date and time when the vehicle was sold
             */
            sold_at?: string | null;
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
             * Organization Id
             * Format: uuid4
             * @description ID of the organization the vehicle belongs to
             */
            organization_id: string;
            /**
             * Model
             * @description Model of the vehicle
             */
            model: string;
            /**
             * Model Year
             * @description Year the vehicle model was manufactured
             */
            model_year: number;
            /** @description Type of fuel the vehicle uses */
            fuel_type: components["schemas"]["FuelType"];
            /**
             * Color
             * @description Color of the vehicle
             */
            color?: string | null;
            /**
             * Description
             * @description Additional description of the vehicle
             */
            description?: string | null;
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
        /** VehicleStatistics */
        VehicleStatistics: {
            /**
             * Total Count
             * @description Total number of vehicles
             */
            total_count: number;
            /**
             * Available Count
             * @description Number of available (unsold) vehicles
             */
            available_count: number;
            /**
             * Fuel Type Distribution
             * @description Count of vehicles by fuel type
             */
            fuel_type_distribution: {
                [key: string]: number;
            };
            /**
             * Brand Distribution
             * @description Count of vehicles by brand
             */
            brand_distribution: {
                [key: string]: number;
            };
            /**
             * Sales By Month
             * @description Number of vehicles sold by month
             */
            sales_by_month: {
                [key: string]: number;
            };
            /**
             * Avg Days To Sell
             * @description Average days from listing to sale
             */
            avg_days_to_sell?: number | null;
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
export type SchemaCustomerCreate = components['schemas']['CustomerCreate'];
export type SchemaCustomerResponse = components['schemas']['CustomerResponse'];
export type SchemaCustomerStatistics = components['schemas']['CustomerStatistics'];
export type SchemaDashboardStatistics = components['schemas']['DashboardStatistics'];
export type SchemaFuelType = components['schemas']['FuelType'];
export type SchemaHttpValidationError = components['schemas']['HTTPValidationError'];
export type SchemaOrganizationCreate = components['schemas']['OrganizationCreate'];
export type SchemaOrganizationResponse = components['schemas']['OrganizationResponse'];
export type SchemaPageVehicleResponse = components['schemas']['Page_VehicleResponse_'];
export type SchemaUserCreate = components['schemas']['UserCreate'];
export type SchemaUserLogin = components['schemas']['UserLogin'];
export type SchemaUserResponse = components['schemas']['UserResponse'];
export type SchemaValidationError = components['schemas']['ValidationError'];
export type SchemaVehicleCreate = components['schemas']['VehicleCreate'];
export type SchemaVehicleMarkAsSold = components['schemas']['VehicleMarkAsSold'];
export type SchemaVehicleResponse = components['schemas']['VehicleResponse'];
export type SchemaVehicleStatistics = components['schemas']['VehicleStatistics'];
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
    VehiclesController_get_vehicles_organizations__organization_id__vehicles__get: {
        parameters: {
            query?: {
                search?: string | null;
                is_new?: string | null;
                is_sold?: string | null;
                /** @description Page number */
                page?: number;
                /** @description Page size */
                size?: number;
            };
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
                    "application/json": components["schemas"]["Page_VehicleResponse_"];
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
    VehiclesController_create_vehicle_organizations__organization_id__vehicles__post: {
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
    VehiclesController_get_vehicle_organizations__organization_id__vehicles__vehicle_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
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
    VehiclesController_update_vehicle_organizations__organization_id__vehicles__vehicle_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
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
    VehiclesController_delete_vehicle_organizations__organization_id__vehicles__vehicle_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
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
    VehiclesController_mark_vehicle_as_sold_organizations__organization_id__vehicles__vehicle_id__mark_as_sold_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
                vehicle_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VehicleMarkAsSold"];
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
    VehiclesController_mark_vehicle_as_unsold_organizations__organization_id__vehicles__vehicle_id__mark_as_unsold_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
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
    CustomersController_get_customers_organizations__organization_id__customers_get: {
        parameters: {
            query?: {
                /** @description Search term for filtering customers */
                search?: string;
            };
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
                    "application/json": components["schemas"]["CustomerResponse"][];
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
    CustomersController_create_customer_organizations__organization_id__customers_post: {
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
                "application/json": components["schemas"]["CustomerCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomerResponse"];
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
    CustomersController_get_customer_organizations__organization_id__customers__customer_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
                customer_id: string;
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
                    "application/json": components["schemas"]["CustomerResponse"];
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
    CustomersController_update_customer_organizations__organization_id__customers__customer_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
                customer_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CustomerCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomerResponse"];
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
    CustomersController_delete_customer_organizations__organization_id__customers__customer_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
                customer_id: string;
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
    StatisticsController_get_dashboard_statistics_organizations__organization_id__statistics_dashboard_get: {
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
                    "application/json": components["schemas"]["DashboardStatistics"];
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
}
