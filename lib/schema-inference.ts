"use client"

export interface ComponentPropSchema {
  type: string
  properties: Record<string, any>
  required: string[]
  default?: any
}

export interface ComponentSchema {
  id: string
  name: string
  category: string
  schema: ComponentPropSchema
  defaultProps: Record<string, any>
}

// Infer JSON schema from shadcn component props
export const inferComponentSchema = (componentType: string): ComponentSchema => {
  const schemas: Record<string, ComponentSchema> = {
    text: {
      id: "text",
      name: "Text",
      category: "basic",
      schema: {
        type: "object",
        properties: {
          content: { type: "string", description: "Text content" },
          fontSize: { type: "string", description: "Font size (e.g., 16px, 1rem)" },
          fontWeight: { type: "string", enum: ["normal", "bold", "light", "medium", "semibold"] },
          color: { type: "string", description: "Text color (hex, rgb, or named)" },
          textAlign: { type: "string", enum: ["left", "center", "right", "justify"] },
          lineHeight: { type: "string", description: "Line height" },
          letterSpacing: { type: "string", description: "Letter spacing" },
          textDecoration: { type: "string", enum: ["none", "underline", "line-through"] },
          fontFamily: { type: "string", description: "Font family" },
        },
        required: ["content"],
      },
      defaultProps: {
        content: "This is a text element. Click to edit.",
        fontSize: "16px",
        fontWeight: "normal",
        color: "#000000",
        textAlign: "left",
        lineHeight: "1.5",
        letterSpacing: "normal",
        textDecoration: "none",
        fontFamily: "inherit",
      },
    },

    heading: {
      id: "heading",
      name: "Heading",
      category: "basic",
      schema: {
        type: "object",
        properties: {
          content: { type: "string", description: "Heading text" },
          level: { type: "string", enum: ["h1", "h2", "h3", "h4", "h5", "h6"] },
          fontSize: { type: "string", description: "Font size" },
          fontWeight: { type: "string", enum: ["normal", "bold", "light", "medium", "semibold"] },
          color: { type: "string", description: "Text color" },
          textAlign: { type: "string", enum: ["left", "center", "right", "justify"] },
          marginTop: { type: "string", description: "Top margin" },
          marginBottom: { type: "string", description: "Bottom margin" },
        },
        required: ["content", "level"],
      },
      defaultProps: {
        content: "Your Heading Here",
        level: "h1",
        fontSize: "32px",
        fontWeight: "bold",
        color: "#000000",
        textAlign: "left",
        marginTop: "0px",
        marginBottom: "16px",
      },
    },

    button: {
      id: "button",
      name: "Button",
      category: "basic",
      schema: {
        type: "object",
        properties: {
          content: { type: "string", description: "Button text" },
          variant: { type: "string", enum: ["default", "destructive", "outline", "secondary", "ghost", "link"] },
          size: { type: "string", enum: ["default", "sm", "lg", "icon"] },
          disabled: { type: "boolean", description: "Whether button is disabled" },
          onClick: { type: "string", description: "Click handler function" },
          backgroundColor: { type: "string", description: "Background color" },
          color: { type: "string", description: "Text color" },
          padding: { type: "string", description: "Padding" },
          borderRadius: { type: "string", description: "Border radius" },
          border: { type: "string", description: "Border style" },
          width: { type: "string", description: "Button width" },
          height: { type: "string", description: "Button height" },
        },
        required: ["content"],
      },
      defaultProps: {
        content: "Click Me",
        variant: "default",
        size: "default",
        disabled: false,
        onClick: "",
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "6px",
        border: "none",
        width: "auto",
        height: "auto",
      },
    },

    input: {
      id: "input",
      name: "Input",
      category: "forms",
      schema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["text", "email", "password", "number", "tel", "url", "search"] },
          placeholder: { type: "string", description: "Placeholder text" },
          label: { type: "string", description: "Input label" },
          value: { type: "string", description: "Input value" },
          disabled: { type: "boolean", description: "Whether input is disabled" },
          required: { type: "boolean", description: "Whether input is required" },
          maxLength: { type: "number", description: "Maximum character length" },
          minLength: { type: "number", description: "Minimum character length" },
          pattern: { type: "string", description: "Validation pattern (regex)" },
          width: { type: "string", description: "Input width" },
          height: { type: "string", description: "Input height" },
        },
        required: ["type"],
      },
      defaultProps: {
        type: "text",
        placeholder: "Enter text...",
        label: "Input Field",
        value: "",
        disabled: false,
        required: false,
        maxLength: 255,
        minLength: 0,
        pattern: "",
        width: "100%",
        height: "40px",
      },
    },

    card: {
      id: "card",
      name: "Card",
      category: "display",
      schema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Card title" },
          description: { type: "string", description: "Card description" },
          content: { type: "string", description: "Card content" },
          variant: { type: "string", enum: ["default", "outline"] },
          padding: { type: "string", description: "Card padding" },
          backgroundColor: { type: "string", description: "Background color" },
          borderRadius: { type: "string", description: "Border radius" },
          boxShadow: { type: "string", description: "Box shadow" },
          border: { type: "string", description: "Border style" },
          width: { type: "string", description: "Card width" },
          height: { type: "string", description: "Card height" },
        },
        required: [],
      },
      defaultProps: {
        title: "Card Title",
        description: "Card description goes here",
        content: "Card content goes here",
        variant: "default",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        width: "100%",
        height: "auto",
      },
    },

    badge: {
      id: "badge",
      name: "Badge",
      category: "display",
      schema: {
        type: "object",
        properties: {
          content: { type: "string", description: "Badge text" },
          variant: { type: "string", enum: ["default", "secondary", "destructive", "outline"] },
          size: { type: "string", enum: ["default", "sm", "lg"] },
          backgroundColor: { type: "string", description: "Background color" },
          color: { type: "string", description: "Text color" },
          padding: { type: "string", description: "Padding" },
          borderRadius: { type: "string", description: "Border radius" },
          fontSize: { type: "string", description: "Font size" },
        },
        required: ["content"],
      },
      defaultProps: {
        content: "Badge",
        variant: "default",
        size: "default",
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
      },
    },

    alert: {
      id: "alert",
      name: "Alert",
      category: "display",
      schema: {
        type: "object",
        properties: {
          content: { type: "string", description: "Alert message" },
          type: { type: "string", enum: ["info", "warning", "success", "error"] },
          variant: { type: "string", enum: ["default", "destructive"] },
          title: { type: "string", description: "Alert title" },
          dismissible: { type: "boolean", description: "Whether alert can be dismissed" },
          backgroundColor: { type: "string", description: "Background color" },
          borderColor: { type: "string", description: "Border color" },
          textColor: { type: "string", description: "Text color" },
          padding: { type: "string", description: "Padding" },
          borderRadius: { type: "string", description: "Border radius" },
        },
        required: ["content"],
      },
      defaultProps: {
        content: "This is an alert message",
        type: "info",
        variant: "default",
        title: "",
        dismissible: false,
        backgroundColor: "#f0f9ff",
        borderColor: "#0ea5e9",
        textColor: "#0c4a6e",
        padding: "16px",
        borderRadius: "6px",
      },
    },

    image: {
      id: "image",
      name: "Image",
      category: "media",
      schema: {
        type: "object",
        properties: {
          src: { type: "string", description: "Image source URL" },
          alt: { type: "string", description: "Alt text for accessibility" },
          width: { type: "string", description: "Image width" },
          height: { type: "string", description: "Image height" },
          objectFit: { type: "string", enum: ["contain", "cover", "fill", "none", "scale-down"] },
          borderRadius: { type: "string", description: "Border radius" },
          border: { type: "string", description: "Border style" },
          boxShadow: { type: "string", description: "Box shadow" },
          opacity: { type: "number", minimum: 0, maximum: 1, description: "Image opacity" },
        },
        required: ["src", "alt"],
      },
      defaultProps: {
        src: "/placeholder.svg?height=200&width=300&text=Image",
        alt: "Image",
        width: "300px",
        height: "200px",
        objectFit: "cover",
        borderRadius: "0px",
        border: "none",
        boxShadow: "none",
        opacity: 1,
      },
    },

    container: {
      id: "container",
      name: "Container",
      category: "layout",
      schema: {
        type: "object",
        properties: {
          padding: { type: "string", description: "Container padding" },
          margin: { type: "string", description: "Container margin" },
          backgroundColor: { type: "string", description: "Background color" },
          borderRadius: { type: "string", description: "Border radius" },
          border: { type: "string", description: "Border style" },
          boxShadow: { type: "string", description: "Box shadow" },
          width: { type: "string", description: "Container width" },
          height: { type: "string", description: "Container height" },
          maxWidth: { type: "string", description: "Maximum width" },
          minHeight: { type: "string", description: "Minimum height" },
          display: { type: "string", enum: ["block", "flex", "grid", "inline-block"] },
          flexDirection: { type: "string", enum: ["row", "column", "row-reverse", "column-reverse"] },
          justifyContent: {
            type: "string",
            enum: ["flex-start", "center", "flex-end", "space-between", "space-around"],
          },
          alignItems: { type: "string", enum: ["flex-start", "center", "flex-end", "stretch"] },
        },
        required: [],
      },
      defaultProps: {
        padding: "20px",
        margin: "0px",
        backgroundColor: "transparent",
        borderRadius: "0px",
        border: "1px dashed #d1d5db",
        boxShadow: "none",
        width: "100%",
        height: "auto",
        maxWidth: "none",
        minHeight: "100px",
        display: "block",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      },
    },
  }

  return schemas[componentType] || schemas.text
}

// Generate collection schema for a component
export const generateCollectionSchema = (componentSchema: ComponentSchema) => {
  return {
    type: "object",
    properties: {
      id: { type: "string", description: "Unique component instance ID" },
      componentType: { type: "string", description: "Type of component" },
      pageId: { type: "string", description: "Page this component belongs to" },
      position: {
        type: "object",
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          index: { type: "number" },
        },
      },
      props: componentSchema.schema,
      metadata: {
        type: "object",
        properties: {
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "string" },
          updated_by: { type: "string" },
        },
      },
    },
    required: ["id", "componentType", "pageId", "props"],
  }
}

// Add this function at the end of the file

export const validateComponentData = (componentType: string, data: any): boolean => {
  try {
    const schema = inferComponentSchema(componentType)

    // Basic validation - check required fields
    for (const requiredField of schema.schema.required) {
      if (!(requiredField in data) && !(requiredField in data.properties)) {
        console.warn(`Missing required field: ${requiredField}`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error(`Validation error for ${componentType}:`, error)
    return false
  }
}

// Add fallback schema for unknown component types
export const getFallbackSchema = (): ComponentSchema => ({
  id: "unknown",
  name: "Unknown Component",
  category: "basic",
  schema: {
    type: "object",
    properties: {
      content: { type: "string", description: "Component content" },
      type: { type: "string", description: "Component type" },
    },
    required: ["content"],
  },
  defaultProps: {
    content: "Unknown component",
    type: "unknown",
  },
})
