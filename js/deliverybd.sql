-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  user_id uuid,
  user_name character varying,
  action character varying NOT NULL,
  entity_type character varying NOT NULL,
  entity_id uuid,
  description text,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.coupon_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  coupon_id uuid,
  order_id uuid,
  customer_id uuid,
  discount_applied numeric NOT NULL,
  used_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coupon_usage_pkey PRIMARY KEY (id),
  CONSTRAINT coupon_usage_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id)
);
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  code character varying NOT NULL,
  name character varying NOT NULL,
  description text,
  discount_type character varying NOT NULL CHECK (discount_type::text = ANY (ARRAY['percentage'::character varying, 'fixed'::character varying, 'free_delivery'::character varying]::text[])),
  discount_value numeric NOT NULL,
  minimum_order_value numeric DEFAULT 0.00,
  maximum_discount numeric,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  name character varying NOT NULL,
  phone character varying,
  email character varying,
  address text,
  city character varying,
  zip_code character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.deliverers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  name character varying NOT NULL,
  cpf character varying,
  phone character varying NOT NULL,
  email character varying,
  motorcycle_plate character varying,
  motorcycle_model character varying,
  type character varying NOT NULL CHECK (type::text = ANY (ARRAY['own'::character varying, 'third-party'::character varying]::text[])),
  salary numeric,
  commission numeric,
  balance numeric DEFAULT 0.00,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'busy'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT deliverers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  type character varying NOT NULL,
  title character varying NOT NULL,
  message text NOT NULL,
  user_id uuid,
  read boolean DEFAULT false,
  related_order_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  product_id uuid,
  product_name character varying NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  customer_id uuid,
  customer_name character varying NOT NULL,
  customer_phone character varying,
  customer_address text,
  deliverer_id uuid,
  status character varying DEFAULT 'novo'::character varying CHECK (status::text = ANY (ARRAY['novo'::character varying, 'aceito'::character varying, 'preparo'::character varying, 'pronto'::character varying, 'saiu_entrega'::character varying, 'entregue'::character varying, 'rejeitado'::character varying, 'cancelado'::character varying]::text[])),
  delivery_address text,
  delivery_fee numeric DEFAULT 0.00,
  subtotal numeric DEFAULT 0.00,
  total_amount numeric DEFAULT 0.00,
  notes text,
  payment_method character varying,
  payment_status character varying DEFAULT 'pending'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT orders_deliverer_id_fkey FOREIGN KEY (deliverer_id) REFERENCES public.deliverers(id)
);
CREATE TABLE public.product_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  name character varying NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  category_id uuid,
  name character varying NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id)
);
CREATE TABLE public.restaurants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  user_id uuid,
  owner_name character varying,
  owner_cpf character varying,
  owner_phone character varying,
  cnpj character varying,
  business_type character varying,
  address text,
  city character varying,
  state character varying,
  zip_code character varying,
  primary_color character varying DEFAULT '#28a745'::character varying,
  delivery_fee numeric DEFAULT 5.00,
  preparation_time integer DEFAULT 30,
  delivery_radius numeric DEFAULT 5.0,
  minimum_order numeric DEFAULT 0.00,
  business_hours jsonb,
  notification_settings jsonb,
  asaas_config jsonb,
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT restaurants_pkey PRIMARY KEY (id),
  CONSTRAINT restaurants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  setting_key character varying NOT NULL,
  setting_value text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT system_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.withdrawal_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id uuid,
  deliverer_id uuid,
  amount numeric NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'paid'::character varying]::text[])),
  rejection_reason text,
  approved_at timestamp with time zone,
  rejected_at timestamp with time zone,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT withdrawal_requests_pkey PRIMARY KEY (id),
  CONSTRAINT withdrawal_requests_deliverer_id_fkey FOREIGN KEY (deliverer_id) REFERENCES public.deliverers(id)
);