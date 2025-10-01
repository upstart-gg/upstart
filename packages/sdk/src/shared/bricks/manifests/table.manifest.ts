import { Type } from "@sinclair/typebox";
import { RiTable2 } from "react-icons/ri";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { colorPreset } from "../props/color-preset";
import { border, rounding } from "../props/border";
import { loop } from "../props/dynamic";
import { cssLength } from "../props/css-length";
import { fontSize } from "../props/text";
import { StringEnum } from "~/shared/utils/string-enum";
import type { BrickExample } from "./_types";
import { grow } from "../props/grow";

export const manifest = defineBrickManifest({
  type: "table",
  name: "Table",
  category: "widgets",
  description: "Displays data in a structured table format with customizable columns and rows.",
  aiInstructions:
    "Use this brick to display structured data like product listings, pricing tables, user lists, or any tabular data. Can consume dynamic data from queries or use static data. Each column can be customized for content type and alignment.",
  consumesMultipleQueryRows: true,
  defaultInspectorTab: "content",
  isContainer: false,
  minHeight: {
    desktop: 200,
  },
  minWidth: {
    desktop: 400,
  },
  defaultWidth: {
    desktop: "100%",
    mobile: "100%",
  },
  icon: RiTable2,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color",
      }),
    ),
    loop: Type.Optional(loop()),
    columns: Type.Array(
      Type.Object({
        header: Type.String({
          title: "Header",
          default: "Column Header",
          metadata: { category: "content" },
        }),
        field: Type.String({
          title: "Field",
          default: "fieldName",
          description: "The field name from the data source or static content",
          metadata: { category: "content" },
        }),
        width: Type.Optional(
          StringEnum(["auto", "min", "1fr", "2fr", "3fr"], {
            title: "Width",
            description: "Column width behavior",
            enumNames: ["Auto", "Minimum", "1 fraction", "2 fractions", "3 fractions"],
            default: "auto",
          }),
        ),
        align: Type.Optional(
          StringEnum(["left", "center", "right"], {
            title: "Alignment",
            description: "Text alignment in this column",
            enumNames: ["Left", "Center", "Right"],
            default: "left",
          }),
        ),
        type: Type.Optional(
          StringEnum(["text", "image", "link", "currency", "date"], {
            title: "Content Type",
            description: "How to render the content in this column",
            enumNames: ["Text", "Image", "Link", "Currency", "Date"],
            default: "text",
          }),
        ),
      }),
      {
        title: "Columns",
        default: [
          { header: "Name", field: "name", width: "2fr", align: "left", type: "text" },
          { header: "Email", field: "email", width: "2fr", align: "left", type: "text" },
          { header: "Role", field: "role", width: "1fr", align: "left", type: "text" },
        ],
        metadata: {
          category: "content",
        },
      },
    ),
    rows: Type.Optional(
      Type.Array(Type.Record(Type.String(), Type.Any()), {
        title: "Static Data",
        description: "Static table data when not using dynamic queries",
        default: [
          { name: "John Doe", email: "john@example.com", role: "Manager" },
          { name: "Jane Smith", email: "jane@example.com", role: "Developer" },
          { name: "Mike Johnson", email: "mike@example.com", role: "Designer" },
        ],
        metadata: {
          category: "content",
          consumeQuery: true,
        },
      }),
    ),
    showHeader: Type.Optional(
      Type.Boolean({
        title: "Show Header",
        description: "Display the table header row",
        default: true,
      }),
    ),
    striped: Type.Optional(
      Type.Boolean({
        title: "Striped Rows",
        description: "Alternate row colors for better readability",
        default: true,
      }),
    ),
    hover: Type.Optional(
      Type.Boolean({
        title: "Hover Effect",
        description: "Highlight rows on hover",
        default: true,
      }),
    ),
    fontSize: Type.Optional(
      fontSize({
        title: "Font Size",
        description: "Text size for table content",
        default: "text-sm",
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "1rem",
        description: "Padding inside table cells",
        title: "Cell Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: Type.Optional(
      rounding({
        default: "rounded-lg",
      }),
    ),
    border: Type.Optional(
      border({
        default: { width: "border", color: "border-gray-200" },
      }),
    ),
    grow: Type.Optional(
      grow({
        default: true,
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Team members table with basic information",
    type: "table",
    props: {
      showHeader: true,
      striped: true,
      hover: true,
      columns: [
        { header: "Name", field: "name", width: "2fr", align: "left", type: "text" },
        { header: "Email", field: "email", width: "2fr", align: "left", type: "text" },
        { header: "Department", field: "department", width: "1fr", align: "left", type: "text" },
        { header: "Role", field: "role", width: "1fr", align: "left", type: "text" },
      ],
      rows: [
        {
          name: "Sarah Johnson",
          email: "sarah@company.com",
          department: "Engineering",
          role: "Senior Developer",
        },
        { name: "Mike Chen", email: "mike@company.com", department: "Design", role: "UX Designer" },
        {
          name: "Emily Rodriguez",
          email: "emily@company.com",
          department: "Marketing",
          role: "Content Manager",
        },
        { name: "David Park", email: "david@company.com", department: "Sales", role: "Account Executive" },
      ],
      colorPreset: { color: "neutral-50" },
      fontSize: "text-sm",
      padding: "0.75rem",
    },
  },
  {
    description: "Product pricing table with currency formatting",
    type: "table",
    props: {
      showHeader: true,
      striped: false,
      hover: true,
      columns: [
        { header: "Product", field: "product", width: "2fr", align: "left", type: "text" },
        { header: "Category", field: "category", width: "1fr", align: "center", type: "text" },
        { header: "Price", field: "price", width: "1fr", align: "right", type: "currency" },
        { header: "Stock", field: "stock", width: "1fr", align: "center", type: "text" },
      ],
      rows: [
        { product: "Wireless Headphones", category: "Audio", price: "299.99", stock: "In Stock" },
        { product: "Bluetooth Speaker", category: "Audio", price: "149.99", stock: "Low Stock" },
        { product: "Smartphone", category: "Mobile", price: "699.99", stock: "In Stock" },
        { product: "Laptop Stand", category: "Accessories", price: "79.99", stock: "Out of Stock" },
      ],
      colorPreset: { color: "primary-50" },
      fontSize: "text-base",
      border: { width: "border-2", color: "border-primary-300" },
      rounding: "rounded-xl",
    },
  },
  {
    description: "Event schedule table with dates and links",
    type: "table",
    props: {
      showHeader: true,
      striped: true,
      hover: false,
      columns: [
        { header: "Event", field: "event", width: "2fr", align: "left", type: "text" },
        { header: "Date", field: "date", width: "1fr", align: "center", type: "date" },
        { header: "Location", field: "location", width: "1fr", align: "center", type: "text" },
        { header: "Register", field: "link", width: "1fr", align: "center", type: "link" },
      ],
      rows: [
        {
          event: "Web Development Workshop",
          date: "2024-03-15",
          location: "Room A",
          link: "/events/workshop",
        },
        { event: "Design Thinking Seminar", date: "2024-03-22", location: "Room B", link: "/events/seminar" },
        { event: "Networking Event", date: "2024-03-29", location: "Main Hall", link: "/events/networking" },
      ],
      colorPreset: { color: "secondary-100" },
      fontSize: "text-sm",
      padding: "1rem",
    },
  },
  {
    description: "Comparison table with centered alignment",
    type: "table",
    props: {
      showHeader: true,
      striped: false,
      hover: false,
      columns: [
        { header: "Feature", field: "feature", width: "2fr", align: "left", type: "text" },
        { header: "Basic", field: "basic", width: "1fr", align: "center", type: "text" },
        { header: "Pro", field: "pro", width: "1fr", align: "center", type: "text" },
        { header: "Enterprise", field: "enterprise", width: "1fr", align: "center", type: "text" },
      ],
      rows: [
        { feature: "Storage Space", basic: "10GB", pro: "100GB", enterprise: "Unlimited" },
        { feature: "Users", basic: "5", pro: "25", enterprise: "Unlimited" },
        { feature: "Support", basic: "Email", pro: "Priority", enterprise: "Dedicated" },
        { feature: "API Access", basic: "❌", pro: "✅", enterprise: "✅" },
      ],
      colorPreset: { color: "accent-50" },
      border: { width: "border", color: "border-accent-300" },
      fontSize: "text-base",
      padding: "1.25rem",
      rounding: "rounded-lg",
    },
  },
  {
    description: "Simple data table without header",
    type: "table",
    props: {
      showHeader: false,
      striped: true,
      hover: true,
      columns: [
        { header: "", field: "label", width: "1fr", align: "left", type: "text" },
        { header: "", field: "value", width: "1fr", align: "right", type: "text" },
      ],
      rows: [
        { label: "Founded", value: "2010" },
        { label: "Employees", value: "250+" },
        { label: "Locations", value: "15 cities" },
        { label: "Revenue", value: "$50M+" },
      ],
      colorPreset: { color: "neutral-100" },
      fontSize: "text-sm",
      padding: "0.5rem",
      border: { width: "border-0", color: "" },
    },
  },
  {
    description: "Dynamic employee table using employees query",
    type: "table",
    props: {
      showHeader: true,
      striped: true,
      hover: true,
      columns: [
        { header: "Full Name", field: "fullName", width: "2fr", align: "left", type: "text" },
        { header: "Position", field: "position", width: "2fr", align: "left", type: "text" },
        { header: "Department", field: "department", width: "1fr", align: "center", type: "text" },
        { header: "Start Date", field: "startDate", width: "1fr", align: "center", type: "date" },
      ],
      rows: [
        {
          fullName: "{{employees.fullName}}",
          position: "{{employees.position}}",
          department: "{{employees.department}}",
          startDate: "{{employees.startDate}}",
        },
      ],
      loop: { over: "employees" },
      colorPreset: { color: "primary-50" },
      fontSize: "text-sm",
      padding: "0.75rem",
    },
  },
  {
    description: "Product catalog using products query with pricing",
    type: "table",
    props: {
      showHeader: true,
      striped: false,
      hover: true,
      columns: [
        { header: "Product", field: "name", width: "2fr", align: "left", type: "text" },
        { header: "Category", field: "category", width: "1fr", align: "center", type: "text" },
        { header: "Price", field: "price", width: "1fr", align: "right", type: "currency" },
        { header: "Status", field: "status", width: "1fr", align: "center", type: "text" },
      ],
      rows: [
        {
          name: "{{products.name}}",
          category: "{{products.category}}",
          price: "{{products.price}}",
          status: "{{products.availability}}",
        },
      ],
      loop: { over: "products" },
      colorPreset: { color: "secondary-100" },
      border: { width: "border-2", color: "border-secondary-300" },
      rounding: "rounded-xl",
    },
  },
  {
    description: "Orders dashboard using orders query with links",
    type: "table",
    props: {
      showHeader: true,
      striped: true,
      hover: true,
      columns: [
        { header: "Order ID", field: "orderId", width: "1fr", align: "left", type: "text" },
        { header: "Customer", field: "customerName", width: "2fr", align: "left", type: "text" },
        { header: "Total", field: "total", width: "1fr", align: "right", type: "currency" },
        { header: "Status", field: "status", width: "1fr", align: "center", type: "text" },
        { header: "View", field: "viewLink", width: "1fr", align: "center", type: "link" },
      ],
      rows: [
        {
          orderId: "{{orders.id}}",
          customerName: "{{orders.customerName}}",
          total: "{{orders.total}}",
          status: "{{orders.status}}",
          viewLink: "/orders/{{orders.id}}",
        },
      ],
      loop: { over: "orders" },
      colorPreset: { color: "accent-50" },
      fontSize: "text-sm",
    },
  },
  {
    description: "Event attendees using attendees query",
    type: "table",
    props: {
      showHeader: true,
      striped: true,
      hover: false,
      columns: [
        { header: "Name", field: "name", width: "2fr", align: "left", type: "text" },
        { header: "Email", field: "email", width: "2fr", align: "left", type: "text" },
        { header: "Company", field: "company", width: "1fr", align: "left", type: "text" },
        {
          header: "Registration Date",
          field: "registrationDate",
          width: "1fr",
          align: "center",
          type: "date",
        },
      ],
      rows: [
        {
          name: "{{attendees.fullName}}",
          email: "{{attendees.email}}",
          company: "{{attendees.company}}",
          registrationDate: "{{attendees.registrationDate}}",
        },
      ],
      loop: { over: "attendees" },
      colorPreset: { color: "neutral-100" },
      border: { width: "border", color: "border-neutral-300" },
      padding: "1rem",
    },
  },
  {
    description: "Invoice items using invoiceItems query with detailed pricing",
    type: "table",
    props: {
      showHeader: true,
      striped: false,
      hover: false,
      columns: [
        { header: "Description", field: "description", width: "3fr", align: "left", type: "text" },
        { header: "Quantity", field: "quantity", width: "1fr", align: "center", type: "text" },
        { header: "Unit Price", field: "unitPrice", width: "1fr", align: "right", type: "currency" },
        { header: "Total", field: "total", width: "1fr", align: "right", type: "currency" },
      ],
      rows: [
        {
          description: "{{invoiceItems.description}}",
          quantity: "{{invoiceItems.quantity}}",
          unitPrice: "{{invoiceItems.unitPrice}}",
          total: "{{invoiceItems.lineTotal}}",
        },
      ],
      loop: { over: "invoiceItems" },
      colorPreset: { color: "primary-100" },
      border: { width: "border-2", color: "border-primary-400" },
      fontSize: "text-base",
      padding: "1rem",
      rounding: "rounded-lg",
    },
  },
];
