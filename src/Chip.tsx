interface ChipProps {
    content: string
}

export default function Chip({ content }: ChipProps) {
    return (
        <div style={{
            borderRadius: "1rem",
            backgroundColor: "purple",
            display: "inline-block",
            padding: "0.2rem",
            paddingLeft: "0.6rem",
            paddingRight: "0.6rem"
        }}>
            {content}
        </div>
    )
}