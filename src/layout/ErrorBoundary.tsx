import { Result, Typography } from 'antd';
import React from 'react';
const { Paragraph, Text } = Typography;

export default class ErrorBoundary extends React.Component<React.PropsWithChildren> {
  readonly state: {
    hasError: boolean;
    errMessage: string;
    errStack: string;
  };
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = {
      hasError: false,
      errMessage: '',
      errStack: ''
    };
  }
  resetError() {
    if (this.state.hasError) {
      this.setState({
        hasError: false,
        errMessage: '',
        errStack: ''
      });
    }
  }
  formatErrorCompoentStack(stackMessge: string): string {
    const stackMessages = stackMessge
      .split('\n    at ')
      .map(mes => mes.split(' (')[0])
      .filter(mes => !mes.includes(location.origin) && mes && mes[0].toUpperCase() === mes[0])
      .reverse()
      .join('/');
    return stackMessages;
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      hasError: true,
      errMessage: error.message,
      errStack: this.formatErrorCompoentStack(errorInfo.componentStack)
    });
    console.log('妈的报错了', error.message, errorInfo);
  }
  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Oops! Something went wrong."
          subTitle="Please refresh the page and try again or contact us"
        >
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16
              }}
            >
              程序出现了异常:
            </Text>
          </Paragraph>
          <Paragraph>
            <Text>{this.state.errMessage}</Text>
          </Paragraph>
          <Paragraph
            style={{ backgroundColor: 'rgb(199 199 200 / 85%)', padding: 16, borderRadius: 8, color: '#626567' }}
          >
            <Text>{this.state.errStack}</Text>
          </Paragraph>
        </Result>
      );
    }
    return this.props.children;
  }
}
